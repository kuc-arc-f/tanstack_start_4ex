import { ChatPost, WorkspaceSettings } from './types';

/** LocalStorage の保存キー定義 */
export const STORAGE_KEYS = {
  POSTS: 'chat_21_posts_v1',
  SETTINGS: 'chat_21_settings_v1',
  SELECTED_ID: 'chat_21_selected_id_v1',
} as const;

/** 初期サンプル投稿データ */
export const INITIAL_POSTS: ChatPost[] = [
  {
    id: 562,
    author: 'User21',
    content: '次回のリリースに向けたフロントエンド改修タスクの一覧をまとめました。\n右枠の返信スレッドに各担当者の進捗や確認事項を登録してください。',
    createdAt: '2026-05-22',
    bookmarked: true,
    replies: [
      {
        id: 101,
        postId: 562,
        author: 'User21',
        content: 'ダッシュボード画面のレイアウト調整完了しました。localStorageへの保存動作も確認済みです。',
        createdAt: '2026-05-22 14:20',
      },
      {
        id: 102,
        postId: 562,
        author: 'Member08',
        content: '検索フィルター機能と右パネルのスレッド返信登録の連携テストも問題ありませんでした！',
        createdAt: '2026-05-22 15:05',
      },
    ],
  },
  {
    id: 561,
    author: 'User21',
    content: 'APIレスポンス形式の仕様変更について。ID採番と日付フォーマット（YYYY-MM-DD）の統一ルールを共有します。',
    createdAt: '2026-05-22',
    bookmarked: false,
    replies: [
      {
        id: 103,
        postId: 561,
        author: 'User21',
        content: 'ドキュメントをイントラネットのWikiへ反映しました。',
        createdAt: '2026-05-22 11:30',
      },
    ],
  },
  {
    id: 560,
    author: 'User21',
    content: '定例ミーティング議事録（5月第4週）：UIコンポーネントの整理とブックマーク機能の追加スケジュールについて議論しました。',
    createdAt: '2026-05-21',
    bookmarked: false,
    replies: [],
  },
];

/** 初期ワークスペース設定 */
export const INITIAL_SETTINGS: WorkspaceSettings = {
  currentUser: 'User21',
  channelTitle: 'chat-21-test',
};
