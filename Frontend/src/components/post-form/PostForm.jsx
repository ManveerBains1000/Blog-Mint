import React,{useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button,Input,Select,RTE} from '../index'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import postService from '../../api/postApi.js'

function PostForm({ post } = {}) {
  const isEditing = Boolean(post?._id);
  const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
    defaultValues:{
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    }
  });
    const navigate = useNavigate();
    const userData = useSelector((state)=> state.authReducer.userData);
   
    const submit = async (data) => { 
      try {
      
        const response = await postService.createPost({
          title:data.title,
          slug:data.slug,
          content:data.content,
          status:data.status,
          featuredImage:data.featuredImage[0],
        });
        
        
         if(response) navigate(`/post/${data.slug}`);

      } catch (error) {
        console.log("add Post error",error);
      }
    }

    const slugTransform = useCallback((value)=>{
      if (value && typeof value === 'string') {
        return value
              .trim()
              .toLowerCase()
              .replace(/[^a-zA-Z\d\s]+/g,"-")
              .replace(/\s/g,"-");
      }
      return "";
    },[]);

    React.useEffect(()=>{
      const subscription = watch((value,{name}) => {
        if (name === "title") {
          setValue("slug",slugTransform(value.title),{shouldValidate:true});
        }
      });
      return () => subscription.unsubscribe();
    },[watch,slugTransform,setValue]);    
  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
      <div className='w-2/3 px-2'>
        <Input
          label="Title: "
          placeholder="Title"
          className="mb-4"
          {...register("title",{required:true})}
        />
        <Input
          label="Slug: "
          placeholder="Slug"
          className="mb-4"
          {...register("slug",{required:true})}
          onInput={(e) => {
            setValue("slug",slugTransform(e.currentTarget.value),{shouldValidate:true});
          }}
        />
        <RTE label="Content: " name="content" control={control} defaultValue={getValues("content")}/>
      </div>
      <div className='w-1/3 px-2'>
          <Input
          label="Featured Image: "
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("featuredImage",{required: !isEditing})}
          />
          
          {isEditing && (
            <div className='w-full mb-4'>
              <img src={post?.featuredImage} alt={post?.title}  className='rounded-lg'/>
            </div>
          )}

          <Select
            options={["active","inactive"]}
            label="Status"
            className="mb-4"
            {...register("status",{required:true})}
          />

          <Button type='submit' bgColor={isEditing ? "bg-green-500" : undefined} textColor={isEditing ? "text-white" : undefined} className='w-full'>
            {isEditing ? "update" : "submit"}
          </Button>
      </div>
    </form>
  )
}

export default PostForm
