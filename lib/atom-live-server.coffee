{CompositeDisposable} = require 'atom'
{allowUnsafeEval} = require 'loophole'
path = require 'path'

# I modified
# live-saver/node_modules/connect/node_modules/morgan/index.js
# add line 12: var Function = require('loophole').Function;
# to let it work in atom.
liveServer =  allowUnsafeEval -> require "../live-server"


module.exports = AtomLiveServer =
  subscriptions: null

  config:
    openInBrowser:
      type: 'string'
      default: 'system'
      title: 'Open in Browser'
      description: '''
      Open the website in this browser when starting the live-server.
      Possible options are:
      'safari'
      'google chrome'
      'firefox'
      'firefoxdeveloperedition'
      ...
      '''

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', {
      'atom-live-server:start-3000': => @startServer(3000),
      'atom-live-server:start-4000': => @startServer(4000),
      'atom-live-server:start-5000': => @startServer(5000),
      'atom-live-server:start-8000': => @startServer(8000),
      'atom-live-server:start-9000': => @startServer(9000)
    }

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  getPaths: ->
    paneItem = atom.workspace.getActivePaneItem()
    file = paneItem?.buffer?.file
    filePath = file?.path

    projectPaths = atom.project.getPaths()
    activeProjectPath = null

    if filePath
      projectPaths.forEach (projectPath) ->
        if filePath.indexOf(projectPath) isnt -1
          activeProjectPath = projectPath

    else
      activeProjectPath = projectPaths[0]
      filePath = ""

    return activeProjectPath

  startServer: (port) ->
    projectPath = @getPaths()

    if !projectPath
      atom.notifications.addWarning "[Live Server] You haven't opened a Project, you must open one."
      return

    params = {
      port: port,
      root: projectPath,
      open: true,
      browser: atom.config.get("atom-live-server.openInBrowser")
    };

    allowUnsafeEval -> liveServer.start params;
