import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button, Container, Input } from '../components'
import authService from '../api/auth'
import { login as authLogin } from '../store/authSlice'

const EditAccount = () => {
  const currentUser = useSelector((state) => state.authReducer.userData)
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || '',
      profileImage: currentUser?.profileImage || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const submit = async (data) => {
    setError('')
    setSuccess('')

    try {
      const updatedUser = await authService.updateAccount({
        username: data.username,
        profileImage: data.profileImage,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })

      if (updatedUser) {
        dispatch(authLogin(updatedUser))
        setSuccess('Account updated successfully.')
      }
    } catch (error) {
      setError(error?.response?.data?.message || error.message)
    }
  }

  return (
    <div className='px-4 py-8 sm:px-6 lg:px-10'>
      <Container>
        <div className='mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06)_0%,_rgba(255,255,255,0.03)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6'>
            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-[var(--theme-muted)]'>Account settings</p>
              <h1 className='mt-2 text-3xl font-bold'>Edit your profile</h1>
              <p className='mt-2 max-w-2xl text-sm leading-7 text-[var(--theme-muted)]'>
                Update your username, optional profile image URL, or change your password securely.
              </p>
            </div>
            <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-xl font-bold text-black'>
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} alt={currentUser.username} className='h-full w-full object-cover' />
              ) : (
                (currentUser?.username?.[0] || 'M').toUpperCase()
              )}
            </div>
          </div>

          {error && <p className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200'>{error}</p>}
          {success && <p className='mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'>{success}</p>}

          <form onSubmit={handleSubmit(submit)} className='mt-6 space-y-6'>
            <div className='grid gap-5 md:grid-cols-2'>
              <Input
                label='Username'
                placeholder='Enter your username'
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username should be at least 3 characters' },
                })}
              />
              <Input
                label='Profile image URL'
                placeholder='Optional image URL'
                {...register('profileImage')}
              />
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <Input
                label='Current password'
                type='password'
                placeholder='Required to change password'
                {...register('currentPassword', {
                  validate: (value) => (!getValues('newPassword') || value ? true : 'Current password is required when changing password'),
                })}
              />
              <div />
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <Input
                label='New password'
                type='password'
                placeholder='Leave blank to keep current password'
                {...register('newPassword', {
                  minLength: {
                    value: 8,
                    message: 'New password should be at least 8 characters',
                  },
                })}
              />
              <Input
                label='Confirm new password'
                type='password'
                placeholder='Repeat the new password'
                {...register('confirmPassword', {
                  validate: (value) => (!getValues('newPassword') || value === getValues('newPassword') ? true : 'Passwords do not match'),
                })}
              />
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4'>
              <p className='text-sm text-[var(--theme-muted)]'>
                Use your current password only when updating credentials.
              </p>
              <Button type='submit' className='min-w-40 bg-white text-black font-semibold' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

export default EditAccount