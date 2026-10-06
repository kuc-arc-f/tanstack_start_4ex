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
  const sql = `
  SELECT * FROM task_item
  WHERE projectId = ${data.projectId}
  ORDER BY id DESC
  `;    
  const sendData = {
    action_name: "select",
    table: "task_item",
    sql: sql,
  };  
  const response = await fetch(Config.EXTERNAL_API_URL + "/api/select", {
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

export const createPost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching createPost...')
  console.info(data)
  try{
    const sql = `
    INSERT INTO task_item ( title, content, projectId, complete,
      status, userId,
      start_date)
    VALUES('${data.title}', '${data.content}', ${data.projectId},
    datetime('${data.complete}', 'localtime'), 
    '${data.status}',
    ${data.userId},
    datetime('${data.start_date}', 'localtime')
    );
    `;    
    const add_iem = {
      action_name: "update",
      table : "task_item",
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
      const sql = `
      UPDATE task_item 
      SET title = '${data.title}',
      content='${data.content}',
      complete = datetime('${data.complete}', 'localtime'),
      start_date = datetime('${data.start_date}', 'localtime'),
      status = '${data.status}'
      WHERE id = ${data.id}
      `;

    const add_iem = {
      action_name: "update",
      table : "task_item",
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
    const sql = `DELETE FROM task_item WHERE id = ${data.id}`;
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