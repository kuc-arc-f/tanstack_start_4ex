import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import React, { useState , useEffect } from 'react';
import { 
  Plus, Check, Trash2, Calendar , 
  Edit2, ExternalLink, X, Bookmark as BookmarkIcon, Search
} from 'lucide-react';
import { fetchPosts, createPost , deletePost } from '../utils/chat'
import Head from "../components/Head"
import LibConfig from "../lib/LibConfig"

export const Route = createFileRoute('/chat_list')({
  component: PostsComponent,
})
interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}
//
export default function PostsComponent() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [project, setProject] = useState<Bookmark[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTodos = async () => {
    try {
      const data = await fetchPosts();
      console.log(data)
      setProject(data)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);  

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newBookmark: Bookmark = {
      name: newTitle.trim(),
      InveiteCode: ""      
    } as Bookmark; // Cast to ensure type matching inside strict mode if needed

    try {
      const name_str = newTitle.trim();
      try{
        await createPost({ data: {name: name_str} })
        fetchTodos()
      }catch(e){console.log(e)}      
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
    setNewTitle('');
    setNewUrl('');
  };

  const handleDelete = async(id: string) => {
    if(!confirm('delete bookmark?')) {
      return
    }
    try {
      const deleteData = {
        id: id
      }
      const target = {
        action: "book_mark_delete",
        path: "/api/book_marks/delete",
        data: JSON.stringify(deleteData)
      }
      const sendJson = JSON.stringify(target)
      console.log(target)
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
  };

  const handleSaveEdit = async (id: string, updatedTitle: string, updatedUrl: string) => {
    let finalUrl = updatedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    try {
      const upData = {
        id: id,
        title: updatedTitle.trim(),
        url: finalUrl,
      }
      const target = {
        action: "book_mark_update",
        path: "/api/book_marks/update",
        data: JSON.stringify(upData)
      }    
      const sendJson = JSON.stringify(target)
      console.log(target)
    } catch (error) {
      console.error('通信に失敗しました:', error);
    }
    setEditingBookmark(null);
  };

  const filteredBookmarks = []

  const searchProc = async () => {
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-12">
      <Head />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 pt-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Chat-List
            </h1>
          </div>
          <p className="text-neutral-500 sm:ml-14 text-sm sm:text-base">Project を保存・管理しましょう。</p>
        </header>

        {/* Add Bookmark Form */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-neutral-200 mb-8 sm:ml-14">
          <h2 className="text-lg font-semibold mb-4 text-neutral-800">新しいChat を追加</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">タイトル(TITLE)</label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例: chat-123"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                disabled={!newTitle.trim()}
              >
                <Plus className="w-5 h-5" />
                <span>追加</span>
              </button>
            </div>
          </form>
        </section>

        {/* List */}
        <section className="sm:ml-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h2 className="text-lg font-semibold text-neutral-800 whitespace-nowrap">
              登録済み Project <span className="text-neutral-400 font-normal ml-1">({bookmarks.length})</span>
            </h2>
            
            {/* Search Input */}
            <div className="flex-1 sm:max-w-xs text-end">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルで検索..."
                className="flex-1 pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="text-end mb-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => searchProc()}
            >Search</button>
          </div>
          
          {project.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 border-dashed">
              <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookmarkIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-medium">Project が登録されていません。</p>
              <p className="text-neutral-400 text-sm mt-1">上のフォームから追加してください。</p>
            </div>                     
          ) : (
            <ul className="space-y-3">
              {project.map((bookmark) => (
                <li key={bookmark.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between group hover:border-blue-300 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <a href={`/chat?chat_id=${bookmark.id}`}>
                      <button 
                        className="text-[24px] font-semibold text-neutral-900 hover:text-blue-600 truncate flex items-center gap-1.5 w-fit"
                        >
                        {bookmark.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Edit Dialog Modal */}
      {editingBookmark && (
        <EditDialog 
          bookmark={editingBookmark} 
          onSave={handleSaveEdit}
          onClose={() => setEditingBookmark(null)} 
        />
      )}
    </div>
  );
}

function EditDialog({ 
  bookmark, 
  onSave, 
  onClose 
}: { 
  bookmark: Bookmark; 
  onSave: (id: string, title: string, url: string) => void; 
  onClose: () => void; 
}) {
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onSave(bookmark.id, title, url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md w-full sm:scale-100 origin-center duration-200 overflow-hidden text-neutral-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-lg font-semibold">ブックマークを編集</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-700 mb-1.5">タイトル(TITLE)</label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-url" className="block text-sm font-medium text-neutral-700 mb-1.5">URL</label>
              <input
                id="edit-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
              disabled={!title.trim() || !url.trim()}
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}