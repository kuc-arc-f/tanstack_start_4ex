import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Home,
  Search,
  SlidersHorizontal,
  UserCircle2,
  X,
  RotateCcw,
  Check,
  Edit3,
  LucideIcon,
} from 'lucide-react';
import { ActiveNav, ChatPost, ReplyItem, WorkspaceSettings } from '../components/chat/types';
import PostList from '../components/chat/PostList';
import ReplyComposer from '../components/chat/ReplyComposer';
import ReplyThreadList from '../components/chat/ReplyThreadList';
import {
  INITIAL_POSTS,
  INITIAL_SETTINGS,
  STORAGE_KEYS,
} from '../components/chat/constants';
import { formatDateTime, formatTodayDate } from '../components/chat/format';
import { fetchPosts, createPost , deletePost , updatePost } from '../utils/chat_posts'
import { threadFetch, threadCreate , threadDelete } from '../utils/threads'
import LibAuth from "../lib/LibAuth"
import Config from "../config"

let chatId = 0;
let userId = 0;
const DEFAULT_AUTHOR = 'User21';

/* ---------- 左サイドバーのナビゲーションボタン（共通UI） ---------- */
interface SidebarNavButtonProps {
  active: boolean;
  onClick: () => void;
  /** 表示するアイコン（未指定の場合はドットを表示） */
  icon?: LucideIcon;
  label: string;
  count: number;
}

function SidebarNavButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: SidebarNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#1868FF] text-white shadow-xs'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="flex items-center gap-2.5">
        {Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : (
          <span
            className={`w-1.5 h-1.5 rounded-full ml-1 mr-0.5 ${
              active ? 'bg-white' : 'bg-slate-600'
            }`}
          />
        )}
        <span>{label}</span>
      </span>
      <span
        className={`text-xs tabular-nums ${active ? 'text-blue-100' : 'text-slate-400'}`}
      >
        {count}
      </span>
    </button>
  );
}

/* ---------- ヘッダー右側のナビゲーションボタン（共通UI） ---------- */

interface HeaderNavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function HeaderNavButton({ active, onClick, label }: HeaderNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-colors whitespace-nowrap ${
        active
          ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );
}
export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})
export default function RouteComponent() {
  const [posts, setPosts] = useState<ChatPost[]>([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    LibAuth.isValidLogin();
    userId = LibAuth.getCookieValue(Config.COOKIE_KEY_UID)
  }, []);
    
  const setThreadData = async function (post_id) {
    try{
      const item = await threadFetch({ data: {chatPostId: post_id} });
      const target = [];
      item.forEach((element, index) => {
        let row = {
          id: element.id,
          postId: element.chatPostId,
          author: element.name,
          content: element.body,
          createdAt: element.createdAt,
        }
        target.push(row)
      })
      console.log(target);
      setThreads(target)
    }catch(e){console.log(e)}
  }

  const fetchChatPost = async () => {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const id_str = searchParams.get('chat_id') || "";
        chatId = Number(id_str);
        console.log("chatId=", chatId )
        const items = await fetchPosts({ data: {chatId: chatId} })
        console.log(items)
        const out_item = [];
        items.forEach((element, index) => {
          //console.log(element);
          let row = {
            id: element.id,
            author: element.name,
            content: element.body,
            createdAt: element.createdAt,
            bookmarked:false,
            replies: [],
          }
          out_item.push(row)
        });        
        if(out_item.length > 0){
          console.log(out_item[0]);
          setSelectedPostId(out_item[0].id);
          await setThreadData(out_item[0].id);
        }
        setPosts(out_item)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    (async () => {
      fetchChatPost();
    })()    
  }, []);

  const [settings, setSettings] = useState<WorkspaceSettings>([]);
  /*
  const [settings, setSettings] = useState<WorkspaceSettings>(() =>
    loadFromStorage<WorkspaceSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS, (parsed) => ({
      ...INITIAL_SETTINGS,
      ...(parsed as Partial<WorkspaceSettings>),
    }))
  );

  */
  const [selectedPostId, setSelectedPostId] = useState(0);

  const [activeNav, setActiveNav] = useState<ActiveNav>('Dashboard');

  // Search states
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearchKey, setAppliedSearchKey] = useState('');

  // New Post input state
  const [newPostContent, setNewPostContent] = useState('');

  // Right panel: Reply input state & Edit post state
  const [replyContent, setReplyContent] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPostText, setEditingPostText] = useState('');

  // Quick user menu / toast feedback
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  /* ---------- localStorage への自動保存 ---------- */

  useEffect(() => {
    try {
      //localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts to localStorage:', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      //localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      if (selectedPostId !== null) {
        //localStorage.setItem(STORAGE_KEYS.SELECTED_ID, String(selectedPostId));
      } else {
        //localStorage.removeItem(STORAGE_KEYS.SELECTED_ID);
      }
    } catch (e) {
      console.error('Failed to save selectedPostId:', e);
    }
  }, [selectedPostId]);

  const triggerToast = useCallback((message: string) => {
    setStatusToast(message);
    window.setTimeout(() => {
      setStatusToast((prev) => (prev === message ? null : prev));
    }, 2400);
  }, []);

  /* ---------- 派生データ ---------- */

  // Filtered posts based on sidebar navigation and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeNav === 'Thread' && post.replies.length === 0) {
        return false;
      }
      if (activeNav === 'BookMark' && !post.bookmarked) {
        return false;
      }
      const query = appliedSearchKey.trim().toLowerCase();
      if (!query) return true;

      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.author.toLowerCase().includes(query);
      const matchId = String(post.id).includes(query);
      const matchReplies = post.replies.some(
        (r) =>
          r.content.toLowerCase().includes(query) ||
          r.author.toLowerCase().includes(query)
      );
      return matchContent || matchAuthor || matchId || matchReplies;
    });
  }, [posts, activeNav, appliedSearchKey]);

  // Currently selected post object
  const selectedPost = useMemo(() => {
    return (
      posts.find((p) => p.id === selectedPostId) ||
      filteredPosts[0] ||
      posts[0] ||
      null
    );
  }, [posts, selectedPostId, filteredPosts]);

  // Keep editing state synced when switching selected post
  useEffect(() => {
    setIsEditingPost(false);
    if (selectedPost) {
      setEditingPostText(selectedPost.content);
    }
  }, [selectedPost?.id]);

  const threadCount = useMemo(
    () => posts.filter((p) => p.replies.length > 0).length,
    [posts]
  );
  const bookmarkCount = useMemo(
    () => posts.filter((p) => p.bookmarked).length,
    [posts]
  );

  /* ---------- Handlers ---------- */

  const handleCreatePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPostContent.trim();
    if (!trimmed) return;

    const newPost: ChatPost = {
      chatId: chatId,
      userId: userId,
      //author: settings.currentUser.trim() || 'User21',
      body: trimmed,
      title: "",
      createdAt: formatTodayDate(),
    };
    try{
      const resp = await createPost({ data: newPost })
      console.log(resp);
      await fetchChatPost();
    }catch(e){ console.log(e) }    

    setNewPostContent('');
    triggerToast(`投稿 (ID: ${newPost.id}) を保存しました`);
  };

  const handleCreateReply = async(e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedPost) return;
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    const newReply: ReplyItem = {
      chatId: chatId,
      userId: userId, 
      chatPostId: selectedPost.id,
      //author: settings.currentUser.trim() || 'User21',
      body: trimmed,
      title: "",
      createdAt: formatDateTime(),
    };
    try{
      const resp = await threadCreate({ data: newReply })
      await setThreadData(selectedPostId)
      console.log(resp);
    }catch(e){ console.log(e) } 

    setReplyContent('');
    triggerToast(`ID: ${selectedPost.id} に返信スレッドを登録しました`);
  };

  const handleDeletePost = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isOk = confirm("delete ok ?");
    if (isOk === false) { return; }
    await deletePost({data: {id: postId}})
    await fetchChatPost();
    triggerToast(`投稿 (ID: ${postId}) を削除しました`);
  };

  // 右枠コンポーネントから呼ばれる返信削除（選択中投稿を対象にする）
  const handleDeleteReply = async(replyId: number) => {
    if (!selectedPost) return;
    console.log("#handleDeleteReply=" + replyId);
    console.log("#selectedPostId=" + selectedPostId);
    await threadDelete({data: {id: replyId}})
    await setThreadData(selectedPostId)
    triggerToast('返信を削除しました');
  };

  const handleToggleBookmark = (postId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
      )
    );
  };

  const handleSaveEditedPost = async() => {
    //console.log("#handleSaveEditedPost")
    //console.log(selectedPost)
    if (!selectedPost) return;
    const trimmed = editingPostText.trim();
    if (!trimmed) return;

    console.log("selectedPost.id=", selectedPost.id)
    const target = {
      id: selectedPost.id,
      body: trimmed,
      title: "",
    };
    await updatePost({data: target })
    setPosts((prev) =>
      prev.map((post) =>
        post.id === selectedPost.id ? { ...post, content: trimmed } : post
      )
    );
    setIsEditingPost(false);
    triggerToast(`ID: ${selectedPost.id} の投稿内容を更新しました`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchKey(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearchKey('');
  };

  const handleResetDemoData = () => {
    setPosts(INITIAL_POSTS);
    setSettings(INITIAL_SETTINGS);
    setSelectedPostId(INITIAL_POSTS[0].id);
    setSearchInput('');
    setAppliedSearchKey('');
    triggerToast('初期サンプルデータを復元しました');
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900">
      {/* Top Window Header Bar (Matches "Home" header in reference image) */}
      <header className="h-11 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveNav('Dashboard');
          }}
          className="text-sm font-semibold tracking-tight text-slate-800 whitespace-nowrap"
        >
          {settings.channelTitle}
        </a>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <HeaderNavButton
            active={activeNav === 'Dashboard'}
            onClick={() => setActiveNav('Dashboard')}
            label="Home"
          />
          <HeaderNavButton
            active={activeNav === 'Thread'}
            onClick={() => setActiveNav('Thread')}
            label={`Thread (${threadCount})`}
          />
          <HeaderNavButton
            active={activeNav === 'BookMark'}
            onClick={() => setActiveNav('BookMark')}
            label={`BookMark (${bookmarkCount})`}
          />
          <HeaderNavButton
            active={activeNav === 'Settings'}
            onClick={() => setActiveNav('Settings')}
            label="Settings"
          />
        </nav>

        <div className="flex items-center gap-3">
          {statusToast && (
            <span className="text-xs text-blue-700 font-medium whitespace-nowrap">
              {statusToast}
            </span>
          )}
          <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
            LocalStorage 保存中 ({posts.length}件)
          </span>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 flex min-h-[calc(100vh-2.75rem)]">
        {/* Left Sidebar (Matches left navigation in ss1005a2.png) */}
        <aside className="w-50 bg-white border-r border-slate-200 flex flex-col justify-between px-4 py-6 shrink-0 select-none">
          <div className="space-y-7">
            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => setActiveNav('Dashboard')}
              className="flex items-center gap-2.5 px-2 text-left group w-full"
            >
              <Home className="w-5 h-5 text-blue-600 stroke-[2.2]" />
              <a href="/">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  home
                </span>
              </a>
            </button>

            {/* Main Menu */}
            <div className="space-y-2">
              <p className="px-2 text-xs font-medium text-slate-400 tracking-wide">
                Main Menu
              </p>

              <nav className="space-y-1">
                <SidebarNavButton
                  active={activeNav === 'Dashboard'}
                  onClick={() => setActiveNav('Dashboard')}
                  icon={Home}
                  label="Dashboard"
                  count={posts.length}
                />
                <SidebarNavButton
                  active={activeNav === 'Thread'}
                  onClick={() => setActiveNav('Thread')}
                  label="Thread"
                  count={threadCount}
                />
                <SidebarNavButton
                  active={activeNav === 'BookMark'}
                  onClick={() => setActiveNav('BookMark')}
                  label="BookMark"
                  count={bookmarkCount}
                />
              </nav>
            </div>
          </div>

          {/* Preferences Bottom Menu */}
          <div className="space-y-2 pt-6 border-t border-slate-100">
            <p className="px-2 text-xs font-medium text-slate-400 tracking-wide">
              Preferences
            </p>
            <SidebarNavButton
              active={activeNav === 'Settings'}
              onClick={() => setActiveNav('Settings')}
              icon={SlidersHorizontal}
              label="Settings"
              count={0}
            />
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col p-5 gap-4 overflow-x-hidden">
          {/* Top Search Key Bar Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-2xs flex items-center justify-between gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setAppliedSearchKey(e.target.value);
                  }}
                  placeholder="Search Key"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-10 pr-9 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    title="検索をクリア"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* User Profile Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserPopover((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={`現在のユーザー: ${settings.currentUser}`}
              >
                <UserCircle2 className="w-9 h-9 text-slate-300 stroke-[1.5]" />
              </button>

              {showUserPopover && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      投稿者名 (User Name)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowUserPopover(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={settings.currentUser}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currentUser: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="User21"
                  />
                  <p className="text-xs text-slate-500">
                    新規投稿および右枠の返信スレッド登録時のユーザー名に反映されます。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings View or Split Workspace View */}
          {activeNav === 'Settings' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  ワークスペース設定 (Settings)
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  投稿者名やチャットタイトル、LocalStorage保存データの管理を行えます。
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    チャットルーム名 (Title)
                  </label>
                  <input
                    type="text"
                    value={settings.channelTitle}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        channelTitle: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    現在の投稿ユーザー名 (User Name)
                  </label>
                  <input
                    type="text"
                    value={settings.currentUser}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currentUser: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 tabular-nums">
                  保存キー: <code className="font-mono">{STORAGE_KEYS.POSTS}</code> · 全{' '}
                  {posts.length} 件の投稿
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>サンプルデータを復元</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('Dashboard');
                      triggerToast('設定を保存しました');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1868FF] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>ダッシュボードへ戻る</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Split Center Feed + Right Thread Detail Pane (Matches ss1005a2.png) */
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* CENTER COLUMN: Post Composer + Post List Rows */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Post Composer Card */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                      {settings.channelTitle}
                    </h1>
                    {activeNav !== 'Dashboard' && (
                      <span className="text-xs font-medium text-blue-600">
                        表示フィルター: {activeNav}
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-3">
                    <textarea
                      rows={3}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          handleCreatePost();
                        }
                      }}
                      placeholder="メッセージを入力して Post をクリック (Ctrl + Enter で送信)..."
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-y min-h-[84px]"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={!newPostContent.trim()}
                        className="px-5 py-2 bg-[#1868FF] hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Post
                      </button>
                      <span className="text-xs text-slate-400">
                        投稿者: {settings.currentUser}
                      </span>
                    </div>
                  </form>
                </div>

                {/* Center Post List (中央の一覧) */}
                <PostList
                  posts={filteredPosts}
                  selectedPostId={selectedPost?.id ?? null}
                  activeNav={activeNav}
                  searchKey={appliedSearchKey}
                  onSelect={setSelectedPostId}
                  onToggleBookmark={handleToggleBookmark}
                  onDelete={handleDeletePost}
                  onResetView={() => {
                    handleClearSearch();
                    setActiveNav('Dashboard');
                  }}
                  setThreadData={setThreadData}
                />
              </div>

              {/* RIGHT COLUMN (右枠: 投稿テキスト表示 & 返信スレッド登録・一覧) */}
              <div className="lg:col-span-5 lg:sticky lg:top-16">
                {/* bg-[#E2E4E8] border border-slate-500 p-5 min-h-[840px] */}
                <div className="bg-[#E2E4E8] border border-slate-500 p-5 min-h-full flex flex-col justify-between gap-5">
                  {selectedPost ? (
                    <div className="space-y-4">
                      {/* Header metadata above the white post text box */}
                      <div className="flex items-center justify-between text-xs text-slate-700 tabular-nums">
                        <span className="font-semibold text-slate-900">
                          {selectedPost.author} · {selectedPost.createdAt} , ID:{' '}
                          {selectedPost.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingPost((prev) => !prev);
                            setEditingPostText(selectedPost.content);
                          }}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditingPost ? 'キャンセル' : '編集'}</span>
                        </button>
                      </div>

                      {/* White Post Content Box (Matches large white box in right pane of ss1005a2.png) */}
                      <div className="bg-white border border-slate-500 p-4 min-h-[165px] flex flex-col justify-between">
                        {isEditingPost ? (
                          <div className="space-y-3 flex-1 flex flex-col">
                            <textarea
                              value={editingPostText}
                              onChange={(e) => setEditingPostText(e.target.value)}
                              rows={4}
                              className="w-full flex-1 border border-slate-300 rounded p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleSaveEditedPost}
                                className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 cursor-pointer"
                              >
                                保存する
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                              {selectedPost.content}
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 tabular-nums">
                              <span>投稿ID: {selectedPost.id}</span>
                              <span>投稿日: {selectedPost.createdAt}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Reply Thread Registration Form (返信スレッド登録) */}
                      <ReplyComposer
                        value={replyContent}
                        onChange={setReplyContent}
                        onSubmit={() => handleCreateReply()}
                      />

                      {/* Reply Thread List (登録済み返信スレッド一覧) */}
                      <ReplyThreadList
                        replies={threads}
                        onDeleteReply={handleDeleteReply}
                      />
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-500 p-6 min-h-[165px] flex items-center justify-center text-sm text-slate-500 text-center">
                      中央の一覧から行（または Show ボタン）をクリックすると、ここに投稿テキストと返信スレッドが表示されます。
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
