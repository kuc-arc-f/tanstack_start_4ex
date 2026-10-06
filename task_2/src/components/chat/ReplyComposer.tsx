import React from 'react';

export interface ReplyComposerProps {
  /** 入力中の返信テキスト */
  value: string;
  /** テキスト変更時のコールバック */
  onChange: (value: string) => void;
  /** Reply ボタン押下 or Ctrl/Cmd + Enter で実行 */
  onSubmit: () => void;
}

/**
 * 右枠の返信スレッド登録フォーム。
 * Ctrl/Cmd + Enter でも送信可能。
 */
export default function ReplyComposer({
  value,
  onChange,
  onSubmit,
}: ReplyComposerProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-2.5"
    >
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            onSubmit();
          }
        }}
        placeholder="選択中の投稿に対する返信スレッドを入力..."
        className="w-full bg-white border border-slate-400 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-y"
      />
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-5 py-2 bg-[#A9BCE0] hover:bg-[#93ABD6] disabled:opacity-50 text-slate-900 border border-slate-400/80 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          Reply
        </button>
      </div>
    </form>
  );
}
