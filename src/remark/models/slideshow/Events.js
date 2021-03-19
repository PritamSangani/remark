import EventEmitter from 'src/remark/models/slideshow/Events'

export default class Events {
	constructor(events) {
		this.events = events
		this.on = this.on.bind(this)

		this.externalEvents = new EventEmitter()
		this.externalEvents.setMaxListeners(0)

		const eventsMap = [
			'showSlide',
			'hideSlide',
			'beforeShowSlide',
			'afterShowSlide',
			'beforeHideSlide',
			'afterHideSlide',
			'toggledPresenter'
		]

		eventsMap.map((eventName) => {
			this.events.on(eventName, (slideIndex) => {
				const slide = this.getSlides()[slideIndex]
				this.externalEvents.emit(eventName, slide)
			})
		})
	}
	on() {
		this.externalEvents.on.apply(this.externalEvents, arguments)
		return this
	}
}
