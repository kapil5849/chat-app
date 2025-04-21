// const express = require('express')
import express from 'express'
import dotenv  from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js'

const app = express()

dotenv.config()

const PORT = process.env.PORT
app.use(express.json())
app.use("/api/auth", authRoutes)


// connectDB();
app.listen(PORT, () => {
    console.log('Server started on PORT : ',PORT);
    connectDB();
})
