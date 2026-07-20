import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../api/postApi.js";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.authReducer.userData);
    const isAuthor = (post && userData) ? (post?.owner?._id === userData.userData.data.data._id) : false;
 
    useEffect(() => {
        if (slug) {
            postService.getPost(slug).then((post) => {
                if (post) setPost(post.data.data);
                else navigate("/");
            });
        } else navigate("/");
        
    }, [slug, navigate]);
    const deletePost = () => {
        postService.deletePost(post.$id).then((status) => {
            if (status) {
                postService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };
    return post ? (
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <Container>
                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06)_0%,_rgba(255,255,255,0.03)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                        <div className="relative">
                            <div className="aspect-[16/9] w-full overflow-hidden bg-black">
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {isAuthor && (
                                <div className="absolute right-4 top-4 flex flex-wrap gap-3 sm:right-6 sm:top-6">
                                    <Link to={`/edit-post/${post._id}`}>
                                        <Button bgColor="bg-white" textColor="text-black" className="shadow-lg shadow-black/20">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button bgColor="bg-black" textColor="text-white" onClick={deletePost}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--theme-muted)]">
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Story</span>
                                {post.owner?.username && (
                                    <span>By {post.owner.username}</span>
                                )}
                                {post.createdAt && (
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                )}
                            </div>

                            <div className="max-w-4xl">
                                <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
                            </div>

                            <div className="prose prose-invert max-w-none prose-p:text-[var(--theme-muted)] prose-headings:text-[var(--theme-text)] prose-a:text-white prose-img:rounded-2xl">
                                <div className="browser-css">
                                    {parse(post.content)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}