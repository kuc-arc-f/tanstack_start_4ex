
const LibChatPost = {

  postMenuHandle: async (
    evtValue, selectedPost, selectedPostId, setSelectedPostMenu
  ) =>{
    if(evtValue === "copy-url"){
      let currentUrl = window.location.href;
      if (currentUrl.includes("&post_id=")) {
        currentUrl = currentUrl.substring(0, currentUrl.indexOf("&post_id="));
      }
      if (!currentUrl.includes("post_id=")) {
        currentUrl = currentUrl + "&post_id=" + selectedPostId
      }
      console.log("currentUrl=", currentUrl);      
      try {
        await navigator.clipboard.writeText(currentUrl);
        setTimeout(() => {
          setSelectedPostMenu("");
        }, 500);         
      } catch (err) {
        console.error('コピーに失敗しました:', err);
      }
    }
    if(evtValue === "copy-text"){
      if(selectedPost){
        console.log("content=", selectedPost.content)
        try {
          await navigator.clipboard.writeText(selectedPost.content);
          setTimeout(() => {
            setSelectedPostMenu("");
          }, 500);         
        } catch (err) {
          console.error('コピーに失敗しました:', err);
        }        
      }
    }
  },

}
export default LibChatPost;