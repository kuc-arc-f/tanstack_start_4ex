import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import Config from "../config"

export type PostType = {
  id: number
  title: string
  body: string
}

export const fetchPosts = createServerFn({ method: 'POST' }).handler(async () => {
  console.info('Fetching posts...')
  const sendDdata = {
    table: "todos",
    sql: `SELECT * FROM todos ORDER by id DESC LIMIT 100;`,
  };  
  try{
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/select", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendDdata)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.text();
    console.log('成功:', result);
    return result
  return posts;
  }catch(e){ console.log(e) }
})

export const createPost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching createPost...')
  console.info(data)
  console.info(data.title)
  const sendDdata = {
    table: "todos",
    sql: `INSERT INTO todos (title) VALUES ('${data.title}');`,
  };  
  try{
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendDdata)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.text();
    console.log('成功:', result);
    return result
  }catch(e){ console.log(e) }
})

export const deletePost = createServerFn({ method: 'POST' }).handler(async ({data}) => {
  console.info('Fetching deletePost...')
  console.info(data)
  const sendDdata = {
    table: "todos",
    sql: `DELETE FROM todos WHERE id = ${data.id};`,
  };  

  try{
    if(!data.id) {
      console.log("error, id none")
      return
    }
    const response = await fetch(Config.EXTERNAL_API_URL + "/api/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendDdata)
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    const result = await response.text();
    console.log('成功:', result);
    return result    
    /*
    const response = await fetch(Config.EXTERNAL_API_URL + "/todos/" + data.id, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    console.log("stat=", response.status)
    const result = await response.text();
    console.log('成功:', result);
    */
  }catch(e){ console.log(e) }
})