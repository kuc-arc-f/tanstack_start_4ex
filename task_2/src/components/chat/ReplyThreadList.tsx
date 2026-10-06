import React from 'react';
import { CornerDownRight, Trash2 } from 'lucide-react';
import { ReplyItem } from '../types';

export interface ReplyThreadListProps {
  /** 表示する返信スレッド一覧 */
  replies: ReplyItem[];
  /** 返信削除（返信ID指定） */
  onDeleteReply: (replyId: number) => void;
}

/**
 * 右枠の登録済み返信スレッド一覧。
 * - 0件時は空状態カードを表示
 * - 各返信には個別削除ボタン付き
 */
export default function ReplyThreadList({
  replies,
  onDeleteReply,
}: ReplyThreadListProps) {
  return (
    <div className="pt-2 space-y-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          <CornerDownRight className="w-3.5 h-3.5 text-slate-600" />
          <span>返信スレッド ({replies.length}件)</span>
        </span>
        <span className="text-slate-500 font-normal">Ctrl+Enter で返信登録</span>
      </div>

      {replies.length === 0 ? (
        <div className="bg-white/75 border border-slate-300 p-4 text-xs text-slate-600 text-center">
          まだ返信スレッドはありません。上の入力欄から「Reply」で返信を登録できます。
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white border border-slate-400 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                <span className="font-bold text-slate-800">{reply.author}</span>
                <div className="flex items-center gap-2">
                  <span>{reply.createdAt}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteReply(reply.id)}
                    title="この返信を削除"
                    className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-wrap break-words leading-relaxed">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
