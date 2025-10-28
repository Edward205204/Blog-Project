import 'reflect-metadata'
import { container } from 'tsyringe'
import { Application } from '~/app.js'

const app = container.resolve(Application)
app.start()
