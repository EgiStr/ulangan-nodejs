import userRouter from './userRouter.js'

export default function routes(app) {
    app.use('/api/v1/users', userRouter());
  }