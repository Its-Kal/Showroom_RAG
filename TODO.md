# TODO: Refactor LoginPage.tsx for UX and Localization

## Steps to Complete

1. **Update Imports:** Add imports for antd components (Form, Input, Button, Space, message) and react-router-dom (Link). ✅
2. **Remove Unused State:** Eliminate message, isSuccess, isError, showPassword states and related logic. ✅
3. **Refactor Form to Ant Design:** Replace HTML form with antd Form, using Form.Item, Input, Input.Password, and Button. ✅
4. **Implement Toast Notifications:** Use message.error for login failures and message.success for success, with 3-second duration for errors. ✅
5. **Localize Texts:** Translate all labels, placeholders, and buttons to Indonesian as specified. ✅
6. **Add "Beranda" Button:** Add Button with Link to "/" next to "Masuk" button, wrapped in Space. ✅
7. **Update Submit Logic:** Change handleSubmit to onFinish, integrate API call with toast messages. ✅
8. **Remove Obsolete JSX:** Delete the message display paragraph and password toggle button. ✅
9. **Test Build:** Run npm run build to ensure no compilation errors. ✅
10. **Manual Testing:** Verify toast on wrong login, translations, and "Beranda" navigation. ✅
11. **Git Commit:** Commit with the specified message format. ✅
12. **Add Pop-up Error Message:** Replace message.error with Modal.error for pop-up dialog on login failure. ✅
