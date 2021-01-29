#!/usr/bin/env node

const fs = require('fs')
const { exit } = require('process');
const chalk = require('chalk')
const clipboardy = require('clipboardy');
const semver = require('semver');


const readPackage = () => {
  try {
    return fs.readFileSync('./package.json', 'utf8')
  } catch (e) {
    const message = `${chalk.red(e.message)}\nRun this command from a directory containing a ${chalk.cyan('package.json')} file.`
    process.exitCode = 1
    throw new Error(message)
  }
}


const parsePackage = package => {
  try {
    return JSON.parse(package)
  } catch (e) {
    const message = `${chalk.red(e.message)}\nVerify ${chalk.cyan('package.json')} in this directory is a valid JSON file`
    process.exitCode = 1
    throw new Error(message)
  }
}

const validateVersion = version => {
  if (!semver.valid(version)) {
    const message = `${chalk.red('Missing valid version in package.json')}\nThe version is not valid: ${chalk.yellow(version)}`
    process.exitCode = 1
    throw new Error(message)
  }
}


const main = () => {
  const package = readPackage()
  const json = parsePackage(package)
  const { name, version } = json

  validateVersion(version)

  const isPrerelease = semver.prerelease(version)
  const nextVersion = semver.inc(version, isPrerelease ? 'prerelease' : 'patch')

  console.log(`📦 ${chalk.cyan(name)} is version ${chalk.yellow(version)}` )
  clipboardy.writeSync(nextVersion);
  console.log(`📋 Copied to clipboard next version => ${chalk.green(nextVersion)}`)
}

try {
  main()
} catch (e) {
  console.log(e.message)
}
