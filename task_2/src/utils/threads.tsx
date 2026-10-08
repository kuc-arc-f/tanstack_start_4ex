import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import Config from "../config"

export type PostType = {
  id: number
  title: string
  body: string
}

export const threadFetch = createServerFn({ method: 'POST' }).handler(async({data}) => {
  console.info('Fetching posts...')
  const sql = `
  SELECT 
  "Thread".id as thread_id
  ,"Thread"."chatId"
  ,"Thread"."chatPostId"
  ,"Thread"."userId"
  ,"Thread".title
  ,"Thread".body
  ,"Thread"."createdAt"
  ,"Thread"."updatedAt"
  ,"User".name
  FROM Thread
  INNER JOIN "ChatPost" ON
  ("Thread".chatPostId = "ChatPost".id)        
  LEFT OUTER JOIN "User" ON
  ("User".id = "Thread"."userId")
  WHERE "Thread"."chatPostId" = ${data.chatPostId}
  ORDER BY Thread.id DESC
  LIMIT 1000
  `;       
  const sendData = {
    action_name: "ex_chat_thread_list",
    sql: sql,
  };  
  const response = await fetch(Config.EXTERNAL_API_URL + "/api/extra", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendData)
  });
  if (!response.ok) {
    throw new Error(`HTTPエラー! ステータス: ${response.status}`);
  }
  const result = await response.json();
  const resp = JSON.parse(result.data)
  //console.log(resp.data);
  return resp.data;
})

export const threadCreate = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching createPost...')
  console.info(data)
  try{
    const sql = `INSERT INTO Thread ( title, body, chatId, chatPostId, userId)
    VALUES('${data.title}', '${data.body}', ${data.chatId},${data.chatPostId}, ${data.userId})
    `;
console.log(sql);    
    const add_iem = {
      action_name: "update",
      table : "ChatPost",
      sql: sql,
    };    
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(add_iem)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.json();
    console.log('成功:', result);
   return result
  }catch(e){ console.log(e) }
})

export const threadDelete = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching deletePost...')
  console.info(data)
  try{
    const sql = `DELETE FROM Thread WHERE id = ${data.id}`;
console.log(sql);    
    const sendItem = {
      action_name: "update",
      table : "task_item",
      sql: sql,
    };    
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendItem)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.json();
    console.log('成功:', result);
   return result
  }catch(e){ console.log(e) }
})