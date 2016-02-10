class Dom

    hiddenClass = 'hidden';

    hide = () ->
        this.$.addClass hiddenClass
        return this

    show = () ->
        this.$.removeClass hiddenClass
        return this

    hideFast = () ->
        this.$.addClass hiddenClass
        return this

    showFast = () ->
        this.$.removeClass hiddenClass
        return this

    isHidden = () ->
        return this.$.hasClass hiddenClass

    isVisible = () ->
        return !this.$.hasClass hiddenClass

    invertVis = () ->
        if this.$.hasClass hiddenClass
            this.$.removeClass hiddenClass
        else
            this.$.addClass hiddenClass
        return this


    disable = () ->
        this.$.addClass 'disable'
        return this

    enable = () ->
        this.$.removeClass 'disable'
        return this

    isEnable = () ->
        return !this.$.hasClass 'disable'

    isDisable = () ->
        return this.$.hasClass 'disable'

    activate = () ->
        this.$.addClass 'active'
        return this

    deactivate = () ->
        this.$.removeClass 'active'
        return this

    isActive = () ->
        return this.$.hasClass 'active'

    addFunctions = (target) ->
        if target.id
            window.id[target.id] = target
        target.$ = window.$ target
        target.hide = hide
        target.show = show
        target.hideFast = hideFast
        target.showFast = showFast
        target.disable = disable
        target.enable = enable
        target.activate = activate
        target.deactivate = deactivate
        target.isActive = isActive
        target.isEnable = isEnable
        target.isHidden = isHidden
        target.isVisible = isVisible
        target.invertVis = invertVis
        return target

    constructor: (item) ->
        if item isnt `undefined`
            return addFunctions item
        window.id = {}
        $( '*', window.document ).each( ->
            tid = this.id;
            if tid isnt `undefined` and tid.length > 0
                addFunctions this
        )