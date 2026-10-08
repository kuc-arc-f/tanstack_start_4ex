import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import Config from "../config"

export type PostType = {
  id: number
  title: string
  body: string
}

export const fetchPosts = createServerFn({ method: 'POST' }).handler(async({data}) => {
  console.info('Fetching posts...')
  const sql = `SELECT "ChatPost".id
  ,"ChatPost"."chatId"
  ,"ChatPost"."userId"
  ,"ChatPost".title
  ,"ChatPost".body
  ,"ChatPost"."createdAt"
  ,"ChatPost"."updatedAt"
  ,"User".name
  FROM ChatPost
  LEFT OUTER JOIN "User" ON
  ("User".id = "ChatPost"."userId")
  WHERE ChatPost.chatId = ${data.chatId}
  ORDER BY ChatPost.id DESC   
  LIMIT 1000    
  `;    
  const sendData = {
    action_name: "ex_chat_post_list",
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
  console.log(resp.data);
  return resp.data;
})

export const createPost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching createPost...')
  console.info(data)
  try{
    const sql = `
    INSERT INTO ChatPost ( chatId, userId, title, body)
    VALUES(${data.chatId}, ${data.userId}, '${data.title}','${data.body}')
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

export const updatePost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching createPost...')
  console.info(data)
  try{
      const sql = `UPDATE ChatPost 
      SET title = '${data.title}', body='${data.body}'
      WHERE id = ${data.id}
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

export const deletePost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching deletePost...')
  console.info(data)
  try{
    const sql = `DELETE FROM ChatPost WHERE id = ${data.id}`;
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