import React from 'react';
import { Bookmark, MessageSquare, Trash2 } from 'lucide-react';
import { ActiveNav, ChatPost } from './types';

export interface PostListProps {
  /** 表示対象の投稿（フィルタ済み） */
  posts: ChatPost[];
  /** 現在選択中の投稿ID */
  selectedPostId: number | null;
  /** 現在のナビゲーション（空状態の「すべて表示に戻す」表示判定に使用） */
  activeNav: ActiveNav;
  /** 適用済み検索キーワード（空状態の判定に使用） */
  searchKey: string;
  /** 投稿行クリック（Show ボタン含む）で選択 */
  onSelect: (postId: number) => void;
  /** ブックマーク切替 */
  onToggleBookmark: (postId: number, e?: React.MouseEvent) => void;
  /** 投稿削除 */
  onDelete: (postId: number, e: React.MouseEvent) => void;
  /** 空状態から「すべて表示に戻す」 */
  onResetView: () => void;
}

/**
 * 中央カラムの投稿一覧。
 * - 0件時は空状態カード（条件クリア用のボタン付き）
 * - 各投稿はクリック可能なカード（選択中は青枠＋リング）
 */
export default function PostList({
  posts,
  selectedPostId,
  activeNav,
  searchKey,
  onSelect,
  onToggleBookmark,
  onDelete,
  onResetView,
  setThreadData,
  postMenuhandleChange,
  selectedPostMenu,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
        <p className="text-sm text-slate-600">
          条件に一致する投稿がありません。
        </p>
        {(searchKey || activeNav !== 'Dashboard') && (
          <button
            type="button"
            onClick={onResetView}
            className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            すべて表示に戻す
          </button>
        )}
      </div>
    );
  }
  //console.log("PostList.selectedPostId=", selectedPostId)

  return (
    <div className="space-y-3.5">
      {posts.map((post) => {
        const isSelected = selectedPostId === post.id;
        return (
          <div
            key={post.id}
            onClick={() => onSelect(post.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(post.id);
              }
            }}
            className={`bg-white rounded-xl p-4 transition-all cursor-pointer text-left border ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500/15 shadow-xs'
                : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
            }`}
          >
            {/* Author & Row Actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {post.author}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-medium text-blue-600">
                      · 選択中
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 line-clamp-6 whitespace-pre-wrap break-words">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => onToggleBookmark(post.id, e)}
                  title={
                    post.bookmarked
                      ? 'ブックマーク解除'
                      : 'ブックマーク登録'
                  }
                  className={`p-1.5 rounded-md transition-colors ${
                    post.bookmarked
                      ? 'text-amber-500 hover:bg-amber-50'
                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark
                    className="w-4 h-4"
                    fill={post.bookmarked ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => onDelete(post.id, e)}
                  title="投稿を削除"
                  className="p-1.5 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {/* menu-copy */}
                <select
                  value={selectedPostMenu}
                  onChange={postMenuhandleChange}
                  className="w-18 px-2 py-1 bg-white text-sm text-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">menu</option>
                  <option value="copy-url">copy URL</option>
                  <option value="copy-text">copy Text</option>
                </select>


              </div>
            </div>

            {/* Horizontal Divider Line */}
            <hr className="border-t border-slate-300 my-2.5" />

            {/* Date & ID Metadata */}
            <div className="flex items-center justify-between text-sm text-slate-800 tabular-nums mb-2.5">
              <span>
                {post.createdAt} , ID: {post.id}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                {/*
                <MessageSquare className="w-3.5 h-3.5" />
                <span>返信 {post.replies.length}件</span>
                */}
              </span>
            </div>

            {/* Show Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(post.id);
                  setThreadData(post.id)
                }}
                className={`px-4 py-1 rounded border text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Show
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}