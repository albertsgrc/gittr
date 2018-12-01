# Gittr

A command line utility to track time using Toggl and Gitlab issues
based on the current checked out branch of a repository.

## Installation

    npm install -g gittr

## Usage

### Configuration

First you must indicate your Gitlab API token, Toggl API token
and repository path.

In order to do that you can run `gittr` with no arguments,
and it will prompt for each of these settings.

    gittr

There is no need to specify Gitlab's server url, it is
automatically retrieved from the repository's `origin` remote.

To reset the configuration:

    gittr reset-config

To reconfigure the repository path:

    gittr set-repository [repository-path]

### Toggl project

You need to create a Toggl project manually.
The project name must match the format: `namespace/project` from
your Gitlab repository.

### Timing

To start a new timer:

    gittr start

This will start a timer with a description set to the current branch name
of the configured repository.

To stop the timer:

    gittr stop

This will stop the toggl timer. If the current branch name matches a Gitlab issue
branch format (`id-issuename`), it will also inform gitlab on the time spent
working on the issue.

To print the current timer:

    gittr current

Here, `repository-path` is an absolute or relative path to the repository.
The argument defaults to the current working directory when not specified.
