using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace NewCostHjy.Controllers
{
    public class ToDoController : Controller
    {
        private ToDoDAL _toDoDAL;

        public ToDoController()
        {
            _toDoDAL = new ToDoDAL();
            // 初始化待办事项表
            _toDoDAL.InitToDoTable();
        }

        // GET: ToDo
        public IActionResult Index()
        {
            var toDoItems = _toDoDAL.GetAllToDoItems();
            return View(toDoItems);
        }

        // GET: ToDo/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: ToDo/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(ToDoItem toDoItem)
        {
            if (ModelState.IsValid)
            {
                toDoItem.CreatedAt = DateTime.Now;
                if (toDoItem.IsCompleted)
                {
                    toDoItem.CompletedAt = DateTime.Now;
                }
                _toDoDAL.AddToDoItem(toDoItem);
                return RedirectToAction(nameof(Index));
            }
            return View(toDoItem);
        }

        // GET: ToDo/Edit/5
        public IActionResult Edit(int id)
        {
            var toDoItem = _toDoDAL.GetToDoItemById(id);
            if (toDoItem == null)
            {
                return NotFound();
            }
            return View(toDoItem);
        }

        // POST: ToDo/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, ToDoItem toDoItem)
        {
            if (id != toDoItem.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var existingItem = _toDoDAL.GetToDoItemById(id);
                if (existingItem != null)
                {
                    if (toDoItem.IsCompleted && !existingItem.IsCompleted)
                    {
                        toDoItem.CompletedAt = DateTime.Now;
                    }
                    else if (!toDoItem.IsCompleted && existingItem.IsCompleted)
                    {
                        toDoItem.CompletedAt = null;
                    }
                    else
                    {
                        toDoItem.CompletedAt = existingItem.CompletedAt;
                    }
                    toDoItem.CreatedAt = existingItem.CreatedAt;
                    _toDoDAL.UpdateToDoItem(toDoItem);
                }
                return RedirectToAction(nameof(Index));
            }
            return View(toDoItem);
        }

        // GET: ToDo/Delete/5
        public IActionResult Delete(int id)
        {
            var toDoItem = _toDoDAL.GetToDoItemById(id);
            if (toDoItem == null)
            {
                return NotFound();
            }
            return View(toDoItem);
        }

        // POST: ToDo/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            _toDoDAL.DeleteToDoItem(id);
            return RedirectToAction(nameof(Index));
        }

        // API: ToDo/Api/List
        [HttpGet("api/ToDo/List")]
        public IActionResult GetToDoList()
        {
            var toDoItems = _toDoDAL.GetAllToDoItems();
            return Json(toDoItems);
        }

        // API: ToDo/Api/Add
        [HttpPost("api/ToDo/Add")]
        public IActionResult AddToDoItem([FromBody] ToDoItem toDoItem)
        {
            if (ModelState.IsValid)
            {
                toDoItem.CreatedAt = DateTime.Now;
                if (toDoItem.IsCompleted)
                {
                    toDoItem.CompletedAt = DateTime.Now;
                }
                int newId = _toDoDAL.AddToDoItem(toDoItem);
                toDoItem.Id = newId;
                return Json(new { success = true, item = toDoItem });
            }
            return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors) });
        }

        // API: ToDo/Api/Update
        [HttpPut("api/ToDo/Update")]
        public IActionResult UpdateToDoItem([FromBody] ToDoItem toDoItem)
        {
            if (ModelState.IsValid)
            {
                var existingItem = _toDoDAL.GetToDoItemById(toDoItem.Id);
                if (existingItem != null)
                {
                    if (toDoItem.IsCompleted && !existingItem.IsCompleted)
                    {
                        toDoItem.CompletedAt = DateTime.Now;
                    }
                    else if (!toDoItem.IsCompleted && existingItem.IsCompleted)
                    {
                        toDoItem.CompletedAt = null;
                    }
                    else
                    {
                        toDoItem.CompletedAt = existingItem.CompletedAt;
                    }
                    toDoItem.CreatedAt = existingItem.CreatedAt;
                    _toDoDAL.UpdateToDoItem(toDoItem);
                    return Json(new { success = true, item = toDoItem });
                }
                return Json(new { success = false, message = "Item not found" });
            }
            return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors) });
        }

        // API: ToDo/Api/Delete
        [HttpDelete("api/ToDo/Delete/{id}")]
        public IActionResult DeleteToDoItem(int id)
        {
            var toDoItem = _toDoDAL.GetToDoItemById(id);
            if (toDoItem != null)
            {
                _toDoDAL.DeleteToDoItem(id);
                return Json(new { success = true });
            }
            return Json(new { success = false, message = "Item not found" });
        }
    }
}