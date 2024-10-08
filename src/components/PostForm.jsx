import { useState } from "react";
import Avatar from "./Avatar";
import useUserStore from "../stores/userStore";
import { ImagesIcon } from "lucide-react";
import { toast } from "react-toastify";
import usePostStore from "../stores/postStore";
import AddPicture from "./AddPicture";

const PostForm = () => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const createPost = usePostStore((state) => state.createPost);

  const [message, setMessage] = useState("");
  const [addPicture, setAddPicture] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const hdlChange = (e) => {
    setMessage(e.target.value);
  };

  const hdlCreatePost = async (e) => {
    try {
      setLoading(true);
      const body = new FormData(); // for sending files
      body.append("message", message);

      if (file) {
        body.append("image", file);
      }

      // for multiple files : use for..of to body.append
      // ---
      // ex. state : files
      // let files
      // for(let el of files) {
      // body.append("image", el);
      // }
      // ---
      // for (let [key, value] of body.entries()) {
      //   console.log(key, value);
      // }
      
      const result = await createPost(token, body, user);
      e.target.closest("dialog").close();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      console.log(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {loading && <span className="loading loading-dots loading-xs">loading...</span> }
      <h3 className="text-xl text-center">Create Post</h3>
      <div className="divider mt-1 mb-0"></div>
      <div className="flex gap-2">
        <Avatar className="w-10 h-10 rounded-full" imgSrc={user.profileImage} />
        <div className="flex flex-col">
          <div className="text-sm">
            {user.firstName} {user.lastName}
          </div>
          <select
            className="select bg-slate-200 select-xs w-full max-w-xs"
            defaultValue={"Who can see?"}
          >
            <option disabled>Who can see?</option>
            <option>Public</option>
            <option>Friends</option>
            <option>Only Me</option>
          </select>
        </div>
      </div>
      <textarea
        className="textarea textarea-ghost"
        placeholder={`What do you think? ${user.firstName}`}
        value={message}
        onChange={hdlChange}
        rows={message.split("\n").length}
      ></textarea>
      {addPicture && (
        <AddPicture
          closeMe={() => setAddPicture(false)}
          file={file}
          setFile={setFile}
        />
      )}
      <div className="flex border rounded-lg p-2 justify-center items-center">
        <p>Add with your post</p>
        <div className="flex gap-2">
          <div
            onClick={() => setAddPicture((prv) => !prv)}
            className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex justify-center items-center active:scale-110 "
          >
            <ImagesIcon className="w-6" color="green" />
          </div>
        </div>
      </div>
      <button
        className={`btn btn-sm ${
          message.trim() ? "btn-primary" : "btn-disabled"
        }`}
        onClick={hdlCreatePost}
      >
        Create Post
      </button>
    </div>
  );
};

export default PostForm;
