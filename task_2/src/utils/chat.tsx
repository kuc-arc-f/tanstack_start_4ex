import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import Config from "../config"

export type PostType = {
  id: number
  title: string
  body: string
}

export const fetchPosts = createServerFn().handler(async () => {
  console.info('Fetching posts...')
  const data = {
    action_name: "select",
    table: "Chat",
    sql: "SELECT * FROM Chat ORDER BY id DESC LIMIT 100;",
  };  
  const response = await fetch(Config.EXTERNAL_API_URL + "/api/select", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
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
    const sql = `INSERT INTO Chat (name) VALUES ('${data.name}');`;
    const sendData: Todo = {
      action_name: "update",
      table : "Chat",
      sql: sql,
    };       
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/update", {
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
    console.log('成功:', result);
   return result
  }catch(e){ console.log(e) }
})

export const deletePost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching deletePost...')
  console.info(data)
  try{
    if(!data.id) {
      console.log("error, id none")
      return
    }
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/todos/" + data.id, {
      method: 'DELETE',
      //body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.json();
    console.log('成功:', result);
  }catch(e){ console.log(e) }
})