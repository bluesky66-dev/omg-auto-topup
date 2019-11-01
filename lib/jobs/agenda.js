/**
 * Module dependencies.
 */
const logger = require('../utils/middlewares/logger');
const Agenda = require('agenda');
const Agendash = require('agendash');
const express = require('express');
const dotenv = require('dotenv');
const walletAutoCheckJob = require('./jobs/walletAutoCheck');

dotenv.config();
const app = express();

const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });

app.use(`/agendash`, Agendash(agenda, {
  middleware: 'express'
}));

agenda.define('Topup wallet automatic check', async (job, done) => {
  await walletAutoCheckJob.check();
  done();
});

async function start () {
  await agenda.start();
  logger.info('agenda is running');
  await agenda.every('5 minutes', 'Topup wallet automatic check');
}

function graceful () {
  agenda.stop(function () {
    process.exit(0);
  });
}

module.exports = start;