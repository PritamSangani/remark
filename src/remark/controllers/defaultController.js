var Keyboard = require('./inputs/keyboard')
	, mouse = require('./inputs/mouse')
	, touch = require('./inputs/touch')
	, message = require('./inputs/message')
	, location = require('./inputs/location')


const Controller = (events, dom, slideshowView, options) => {
	options = options || {}

	var keyboard = new Keyboard(events)

	message.register(events)
	location.register(events, dom, slideshowView)
	mouse.register(events, options)
	touch.register(events, options)

	addApiEventListeners(events, keyboard, slideshowView, options)
}

function addApiEventListeners(events, keyboard, slideshowView, options) {
	events.on('pause', () => {
		keyboard.deactivate()
		mouse.unregister(events)
		touch.unregister(events)
	})

	events.on('resume', () => {
		keyboard.activate()
		mouse.register(events, options)
		touch.register(events, options)
	})
}

export default Controller
