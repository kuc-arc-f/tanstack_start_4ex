import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import React, { useState , useEffect } from 'react';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';
import { Todo } from '../components/todo/types';
import { TodoDialog } from '../components/todo/TodoDialog';
import { fetchPosts, createPost , deletePost } from '../utils/todos'

export const Route = createFileRoute('/todos')({
  component: PostsComponent,
})

function PostsComponent() {
  const [todos, setTodos] = useState([])

  const fetchTodos = async () => {
    try {
      const data = await fetchPosts();
      console.log(data)
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleOpenNew = () => {
    setSelectedTodo(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedTodo(null), 200); // Clear after fade out
  };

  const handleSaveTodo = async(data: { title: string; description: string }) => {
    if (selectedTodo) {
      // Edit existing
      setTodos(todos.map(t =>
        t.id === selectedTodo.id ? { ...t, ...data } : t
      ));
    } else {
      // Create new
      const newTodo: Todo = {
        title: data.title,
        //description: data.description,
      };
      console.log(newTodo)
      try{
        await createPost({ data: newTodo })
        await fetchTodos();
      }catch(e){console.log(e)}
    }
    handleCloseDialog();
  };

  const handleToggleComplete = async(id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dialog when clicking checkbox
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDelete = async(id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dialog when clicking delete
    try{
      const item = { id: id }
      await deletePost({ data: item })
    }catch(e){console.log(e)}
    setTodos(todos.filter(t => t.id !== id));
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = [];

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
  <>
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 sm:p-8 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              TODO
            </h1>
            <p className="text-stone-500 mt-1 text-sm font-medium">
              {pendingTodos.length}件の未完了タスク
            </p>
          </div>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">新規作成</span>
          </button>
        </header>

        {/* Main content area */}
        <main className="space-y-6">
          {todos.length === 0 ? (
            <div className="text-center py-24 px-6 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
              <p className="text-stone-500 font-medium text-lg">タスクがありません</p>
              <p className="text-sm text-stone-400 mt-2">右上のボタンから新しいTODOを追加してください</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Pending list */}
              {pendingTodos.map(todo => (
                <div
                  key={todo.id}
                  onClick={() => handleOpenEdit(todo)}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <button
                      onClick={(e) => handleToggleComplete(todo.id, e)}
                      className="mt-0.5 sm:mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-stone-300 hover:border-stone-400 flex items-center justify-center transition-colors"
                    >
                      <span className="sr-only">完了にする</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-stone-900 truncate">
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-sm text-stone-500 mt-1 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-400 font-medium">
                        <Calendar size={12} />
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:opacity-0 group-hover:opacity-100 transition-opacity items-center">
                    <button
                      onClick={(e) => handleDelete(todo.id, e)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="削除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Completed list */}
              {completedTodos.length > 0 && (
                <div className="pt-8 mt-8 border-t border-stone-200">
                  <h2 className="text-xs font-bold text-stone-400 mb-4 uppercase tracking-wider">
                    完了済み ({completedTodos.length})
                  </h2>
                  <div className="space-y-3">
                    {completedTodos.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => handleOpenEdit(todo)}
                        className="group flex items-start gap-4 p-4 bg-stone-50/80 border border-stone-200/60 rounded-xl cursor-pointer transition-all hover:bg-stone-100/80"
                      >
                        <button
                          onClick={(e) => handleToggleComplete(todo.id, e)}
                          className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 border-2 border-stone-900 flex items-center justify-center transition-colors hover:bg-stone-800"
                        >
                          <Check size={14} className="text-white" />
                        </button>
                        <div className="flex-1 min-w-0 opacity-50">
                          <h3 className="text-base font-medium text-stone-900 line-through truncate">
                            {todo.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => handleDelete(todo.id, e)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          aria-label="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Dialog overlay for New/Edit */}
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveTodo}
        todo={selectedTodo}
      />
    </div>

  </>
  )
}
