import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { errorHandler } from './middleware/error-handler'
import { notFound } from './middleware/not-found'

// Routes
import authRoutes from './routes/auth.routes'
import storeRoutes from './routes/store.routes'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/stores', storeRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

const PORT = config.port

app.listen(PORT, () => {
  console.log(`🚀 ETIC API Server running on port ${PORT}`)
  console.log(`📍 Environment: ${config.nodeEnv}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})
