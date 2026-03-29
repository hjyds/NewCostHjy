using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using NewCostHjy.App_Start;
using NewCostHjy.BLL;
using NewCostHjy.Common;
using NewCostHjy.Models;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Reflection;

namespace NewCostHjy {
    public class Startup {
         
        public Startup(IConfiguration configuration, IWebHostEnvironment env) {
 
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {

            bool blnDPFTest = false;
            string strTmp = Configuration.GetSection("PDFUsed").Value;
            if(strTmp=="1") blnDPFTest = true;
            #region PDF相关配置
            if (blnDPFTest)
            {
                services.AddControllers();
                services.Configure<ConfigInfo>(Configuration.GetSection("ConfigInfo"));
                services.AddSingleton<ICISComponentService, CISComponentService>();
                services.AddSingleton<IRequestQueueService, RequestQueueService>();
                services.AddHostedService<InitCISHostedService>();
                services.AddHostedService<MessageQueueService>();
            }
            #endregion


            services.AddSwaggerGen(c => {
                c.SwaggerDoc(
                    "v1", new OpenApiInfo {
                        Title = "hjy文档",
                        Version = "v1",
                        Description = "hjy说明",
                        //Contact = new OpenApiContact {
                        //    Name = "zyk",
                        //    Email = "zyk@zlsoft.cn",
                        //    Url = new Uri("http://www.zlhis.com")
                        //}
                    });

                // 为 Swagger JSON and UI设置xml文档注释路径
                var basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(basePath, xmlFile);
                c.IncludeXmlComments(xmlPath, true);
            });

             

            services.AddControllersWithViews().AddNewtonsoftJson(options => {
                options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
                //设置约定首字母小写的json
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                //设置循环引用
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            //日志过滤器
            services.AddMvc(options => {
                options.Filters.Add(new ActionFilter());
            }).AddNewtonsoftJson(
                option => {
                    option.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
                });             

            //1、创建一个跨域资源的许可
            services.AddCors(options => {
                options.AddPolicy("CustomCorsPolicy", policy => {
                    // 设置允许跨域的源，多个源用逗号隔开
                    policy.WithOrigins()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();
                });
            });

            services.AddControllersWithViews(); 
        }
         
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {

            SiteConfigMain.TestConnStr = Configuration.GetSection("ZLHISCONN").Value;

            System.Console.WriteLine("通用WEB系统服务接口测试桩模块！");

            //new ZlhisInterfaceBLL().TestFunc();
            //string strTemp = new NewCostHjy.Common.FunTestCom().DecryptString("UBVagpW", "zlsoft.third.ftp");
          
            //跨域
            app.UseCors("CustomCorsPolicy");

            #region Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApiHelp V1");
            });
            #endregion

            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            // 重定向中间件 - 在 UseRouting() 之前
            //将请求的地址重定向到一个新的地址
            app.Use(async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments("/GeneralBusinessUI/Prompt"))
                {
                    var query = context.Request.QueryString;
                    context.Response.Redirect($"/PatientVte/Prompt{query}");
                    return;
                }
                if (context.Request.Path.StartsWithSegments("/unit/pageViewById"))
                {
                    var query = context.Request.QueryString;
                    context.Response.Redirect($"/HrsPage/PageViewById{query}");
                    return;
                }
                if (context.Request.Path.StartsWithSegments("/unit/clinicalStaffQuery"))
                {
                    var query = context.Request.QueryString;
                    context.Response.Redirect($"/HrsPage/ClinicalStaffQuery{query}");
                    return;
                }
                await next();
            });


            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            }); 
        }
    }
}