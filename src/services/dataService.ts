import axios, { AxiosError } from 'axios'
import {
  chatListData,
  createChat,
  deletePhoto,
  editFile,
  getChannelChat,
  getChat,
  getFile,
  getLeftProfile,
  getMessages,
  initiateProfile,
  myProfile,
  sendMessage,
  uploadFile,
  usernameValidation,
} from '@/api/data'
import { UISlice } from '@/redux/slices/UISlice'
import { UserSlice } from '@/redux/slices/UserSlice'
import store from '@/redux/store'
import { MessageSlice } from '@/redux/slices/MessageSlice'
import { ActiveChatSlice } from '@/redux/slices/ActiveChatSlice'
import { ChatListSlice } from '@/redux/slices/ChatListSlice'
import LeftSection from '@/components/LeftSection/LeftSection'
import { LeftSectionSlice } from '@/redux/slices/LeftSectionSlice'

export function ChatListDataService() {
  chatListData()
    .then(res => {
      console.log('THIS', res)
      if (res.status === 200) {
        store.dispatch(ChatListSlice.actions.setChatBox(res.data))
      }
    })
    .catch(err => {
      store.dispatch(
        UISlice.actions.openSnack({
          text: `Login failed:${err}`,
          severity: 'error',
        })
      )
    })
}
export function getMessagesService(chatId: string, type: string) {
  console.log('type', type)
  if (type === 'PV') {
    // store.dispatch(ActiveChatSlice.actions.setActiveChat({ id: chatId }))
    // get chat messages
    getMessages({ chatId })
      .then(res => {
        console.log(res)
        if (res.status == 200) {
          store.dispatch(
            MessageSlice.actions.setData({
              id: chatId,
              messages: res.data.messages.reverse(),
            })
          )
          console.log('inside status 200', res.data.id, res.data.chat)
          store.dispatch(
            ActiveChatSlice.actions.setActiveChat({
              id: parseInt(chatId, 10),
              type: 'PV',
            })
          )
        } else {
          store.dispatch(
            UISlice.actions.openSnack({
              text: 'دریافت پیام ها با خطا مواجه شد',
              severity: 'error',
            })
          )
        }
      })
      .catch(err => {
        store.dispatch(
          UISlice.actions.openSnack({
            text: `fetching messages failed:${err}`,
            severity: 'error',
          })
        )
      })
  }
}

export function sendMessageService(
  message: string,
  chatId: string,
  type: string
) {
  sendMessage({ message, chatId, type })
    .then(res => {
      if (res.status == 200) {
        store.dispatch(MessageSlice.actions.sendMessage({ message, chatId }))
      }
    })
    .catch(err => {
      store.dispatch(
        UISlice.actions.openSnack({
          text: `sending message failed:${err}`,
          severity: 'error',
        })
      )
    })
}
export function createChatService(profileId: string) {
  createChat({ profileId })
    .then(res => {
      if (res.status == 200) {
        console.log(res)
        store.dispatch(
          ActiveChatSlice.actions.setActiveChat({
            id: res.data.chatId,
            type: 'PV',
          })
        )
      }
    })
    .catch(err => {
      store.dispatch(
        UISlice.actions.openSnack({
          text: `creating chat failed:${err}`,
          severity: 'error',
        })
      )
    })
}
export function initiateProfileService(
  username: string,
  firstName: string,
  lastName: string,
  bio: string,
  photoId: number
) {
  initiateProfile({ username, firstName, lastName, bio, photoId })
    .then(res => {
      if (res.status === 200) {
        store.dispatch(
          UISlice.actions.openSnack({
            text: 'Register success',
            severity: 'success',
          })
        )
        store.dispatch(UISlice.actions.initialProfileCreatedHandler(true))
        store.dispatch(UISlice.actions.chatColumnHandler(true))
      } else {
        store.dispatch(
          UISlice.actions.openSnack({
            text: 'Register failed',
            severity: 'error',
          })
        )
      }
    })
    .catch(err => {
      store.dispatch(
        UISlice.actions.openSnack({
          text: `Login failed:${err}`,
          severity: 'error',
        })
      )
    })
}
export function usernameValidationService(username: string) {
  usernameValidation({ username })
    .then(res => {
      if (res.status === 200) {
        store.dispatch(UISlice.actions.userNameHandler(true))
      } else {
        store.dispatch(UISlice.actions.userNameHandler(false))
      }
    })
    .catch(err => {
      store.dispatch(UISlice.actions.userNameHandler(false))
      // store.dispatch(
      //   UISlice.actions.openSnack({
      //     text: `u:${err}`,
      //     severity: 'error',
      //   })
      // )
    })
}
export function myProfileService() {
  myProfile()
    .then(res => {
      if (res?.status === 200) {
        store.dispatch(UserSlice.actions.setUserName(res.data.username))
        store.dispatch(UserSlice.actions.setFirstName(res.data.firstName))
        store.dispatch(UserSlice.actions.setLastName(res.data.lastName))
        store.dispatch(UserSlice.actions.setBio(res.data.bio))
        store.dispatch(UserSlice.actions.setImage(res.data.photo))
      } else {
        store.dispatch(
          UISlice.actions.openSnack({
            text: 'Register failed',
            severity: 'error',
          })
        )
      }
    })
    .catch((err: AxiosError) => {
      console.log(err)
      if (err.response?.status == 403) {
        console.log('inside if')
        store.dispatch(UserSlice.actions.deleteToken())
      }
      store.dispatch(
        UISlice.actions.openSnack({
          text: `خطای پروفایل :${err.message}`,
          severity: 'error',
        })
      )
    })
}
export function uploadProfilePhotoService(file: FormData) {
  uploadFile({ file })
    .then(res => {
      console.log(res.data.id)
      localStorage.setItem('imageId', String(res.data.id))
      store.dispatch(UserSlice.actions.setImageId(res.data.id))
    })
    .catch(err => {})
}

export function deleteProfilePhotoService() {
  deletePhoto()
    .then(res => {
      console.log(1)
    })
    .catch(err => {})
}

export function editProfilePhotoService(file: FormData, photoId: number) {
  editFile({ file, photoId })
    .then(res => {
      console.log(res.data)
      // store.dispatch(UserSlice.actions.setImageId(res.data.id))
    })
    .catch(err => {})
}

// export function getProfilePhotoService(fileId: number) {
//   getFile({ fileId })
//     .then(res => {
//       store.dispatch(UserSlice.actions.setImage(res.data.photo))
//     })
//     .catch(err => {})
// }

export function channelLeftSectionService(chatId: number) {
  getChannelChat({ chatId })
    .then(res => {
      // store.dispatch(LeftSectionSlice.actions)
    })
    .catch(err => {})
}

export function getLeftProfileService(profileId: number) {
  getLeftProfile({ profileId })
    .then(res => {
      console.log(res)
      // store.dispatch(LeftSectionSlice.actions)
    })
    .catch(err => {})
}
