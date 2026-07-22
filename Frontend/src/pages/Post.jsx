import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../api/postApi.js";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.authReducer.userData);
    const currentUser = userData?.userData?.data?.data;
    const isAuthor = Boolean(post && currentUser && post?.owner?._id === currentUser?._id);
 
    useEffect(() => {
        if (slug) {
            postService.getPost(slug).then((post) => {
                if (post) setPost(post.data.data);
                else navigate("/");
            });
        } else navigate("/");
        
    }, [slug, navigate]);

    useEffect(() => {
        if (!post?._id) return;

        let isMounted = true;
        setCommentsLoading(true);

        postService.getCommentsByPost(post._id).then((response) => {
            if (!isMounted) return;

            if (response) {
                setComments(response.data.data || []);
            } else {
                setComments([]);
            }
        }).finally(() => {
            if (isMounted) setCommentsLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [post?._id]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!commentBody.trim() || !post?._id) return;

        setSubmittingComment(true);
        try {
            const response = await postService.createComment(post._id, commentBody);
            if (response) {
                setCommentBody("");
                const refreshed = await postService.getCommentsByPost(post._id);
                if (refreshed) {
                    setComments(refreshed.data.data || []);
                }
            }
        } finally {
            setSubmittingComment(false);
        }
    };

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

                            <section className="rounded-[1.5rem] border border-white/10 bg-color-[#000000] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:p-6">
                                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white sm:text-2xl">Comments</h2>
                                        <p className="mt-1 text-sm text-[#e0e1dd]/70">
                                            Share your thoughts on this blog post.
                                        </p>
                                    </div>
                                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#e0e1dd]/80">
                                        {comments.length} {comments.length === 1 ? "comment" : "comments"}
                                    </div>
                                </div>

                                <form onSubmit={handleCommentSubmit} className="mt-5 space-y-3">
                                    <label className="block text-sm font-medium text-[#e0e1dd]/85" htmlFor="comment-body">
                                        Add a comment
                                    </label>
                                    <textarea
                                        id="comment-body"
                                        value={commentBody}
                                        onChange={(event) => setCommentBody(event.target.value)}
                                        rows={4}
                                        placeholder="Write a thoughtful comment..."
                                        className="w-full rounded-2xl border border-white/10 bg-[#212529] px-4 py-3 text-[#e0e1dd] outline-none transition placeholder:text-[#e0e1dd]/40 focus:border-[#778da9] focus:ring-2 focus:ring-[#778da9]/30"
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-[#e0e1dd]/55">
                                            Comments are linked to this post and saved with your account.
                                        </p>
                                        <Button
                                            type="submit"
                                            bgColor="bg-[#f8f9fa]"
                                            textColor="text-[#0d1b2a]"
                                            className="min-w-32 font-semibold shadow-[0_12px_30px_rgba(119,141,169,0.3)]"
                                            disabled={submittingComment || !commentBody.trim()}
                                        >
                                            {submittingComment ? "Posting..." : "Post Comment"}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-6 space-y-4">
                                    {commentsLoading ? (
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#e0e1dd]/70">
                                            Loading comments...
                                        </div>
                                    ) : comments.length ? (
                                        comments.map((comment) => (
                                            <article
                                                key={comment._id}
                                                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#e0e1dd]/70">
                                                    <span className="font-medium text-[#e0e1dd]">
                                                        {comment.author?.username || "Reader"}
                                                    </span>
                                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#e0e1dd]/90">
                                                    {comment.content}
                                                </p>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-[#e0e1dd]/65">
                                            No comments yet. Be the first to react to this post.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}