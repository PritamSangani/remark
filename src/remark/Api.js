import { EventEmitter } from 'events'
import highlighter from './highlighter'
import Converter from './Converter'
import resources from './resources'
import Parser from './Parser'
import Slideshow from './models/slideshow'
import SlideshowView from './views/slideshowView'
import DefaultController from './controllers/defaultController'
import Dom from './Dom'
import macros from './macros'

export default class Api {

	constructor(dom) {
		this.dom = dom || new Dom()
		this.macros = macros
		this.version = resources.version
		this.highlighter = highlighter
		this.converter = new Converter()

		this.convert = this.convert.bind(this)
		this.create = this.create.bind(this)
	}

	convert(markdown) {
		const content = Parser.parse(markdown || '', macros)[0].content


		return this.converter.convertMarkdown(content, {}, true)
	}

	create(options, callback) {
		options = Api.applyDefaults(this.dom, options)

		let events = new EventEmitter()
		events.setMaxListeners(0)

		return new Slideshow(events, this.dom, options, (slideshow) => {
			let slideshowView = new SlideshowView(events, this.dom, options, slideshow)
			// eslint-disable-next-line no-unused-vars
			let controller = options.controller || new DefaultController(events, this.dom, slideshowView, options.navigation)
			if(typeof callback === 'function') {
				callback(slideshow)
			}
		})
	}

	static applyDefaults(dom, options) {
		options = options || {}

		const unescape = (source) => {
			return source.replace(/&[l|g]t;/g, (match) => (match === '&lt;' ? '<' : '>'))
				.replace(/&amp;/g, '&')
				.replace(/&quot;/g, '"')
		}

		if(!Object.prototype.hasOwnProperty.call(options, 'source')) {
			let sourceElement = dom.getElementById('source')

			if(sourceElement) {
				options.source = unescape(sourceElement.innerHTML)
				sourceElement.style.display = 'none'
			}
		}

		if(!(options.container instanceof window.HTMLElement)) {
			options.container = dom.getBodyElement()
		}

		return options
	}

}
