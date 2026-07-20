import React from 'react'
import { Link } from 'react-router-dom'
import {Logo} from '../index.js'
import { useSelector } from 'react-redux'

function Footer() {
    const authStatus = useSelector((state) => state.authReducer.status)
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[color:rgba(5,5,5,0.82)] py-10 text-[var(--theme-muted)] backdrop-blur-xl">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="40px" />
                            </div>
                            <p className="max-w-md text-sm leading-7">
                                A cleaner publishing experience for readers and authors, with session-aware navigation and protected post views.
                            </p>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[var(--theme-text)]">
                                Company
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/"
                                    >
                                        Home
                                    </Link>
                                </li>
                                {authStatus && (
                                  <li className="mb-4">
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/all-posts"
                                    >
                                        All Posts
                                    </Link>
                                  </li>
                                )}
                                {authStatus && (
                                  <li>
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/user-posts"
                                    >
                                        User Posts
                                    </Link>
                                  </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[var(--theme-text)]">
                                Support
                            </h3>
                            <ul>
                                                                {!authStatus && (
                                                                    <li className="mb-4">
                                                                        <Link
                                                                                className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                                                                to="/login"
                                                                        >
                                                                                Login
                                                                        </Link>
                                                                    </li>
                                                                )}
                                                                {!authStatus && (
                                                                    <li>
                                                                        <Link
                                                                                className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                                                                to="/signup"
                                                                        >
                                                                                Signup
                                                                        </Link>
                                                                    </li>
                                                                )}
                                {authStatus && (
                                  <li>
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/add-post"
                                    >
                                        Add Post
                                    </Link>
                                  </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[var(--theme-text)]">
                                Legals
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/"
                                    >
                                        Terms
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-base font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-text)]"
                                        to="/"
                                    >
                                        Licensing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default Footer