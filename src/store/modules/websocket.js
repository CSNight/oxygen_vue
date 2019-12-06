import {Message} from "element-ui";

const websocket = {
    events: {
        eventMethods: [],
        async: function (args, handler) {
            setTimeout(function () {
                handler.method.apply(handler.method, [args])
            }, handler.delay * 1000);
        },
        on: function (eventName, listener, id) {
            if (!this.eventMethods) this.eventMethods = [];
            let delay = 0;
            let identifier = "";
            if (arguments.length === 3 && isNaN(arguments[2])) {
                delay = parseInt(arguments[2]);
                identifier = "";
            } else if (arguments.length === 3 && !isNaN(arguments[2])) {
                identifier = id;
            } else if (arguments.length === 4) {
                delay = parseInt(arguments[3]);
                identifier = id;
            }
            this.eventMethods.push({
                identifier: identifier,
                eventName: eventName,
                method: listener,
                delay: delay
            });
            return identifier;
        }, trigger: function (eventName, data) {
            if (!this.eventMethods) this.eventMethods = [];
            for (let index = 0; index < this.eventMethods.length; index++) {
                let handler = this.eventMethods[index];
                if (handler.eventName === eventName) {
                    this.async(data, handler);
                }
            }
        }, triggerAll: function (eventName, data) {
            if (!this.eventMethods) this.eventMethods = [];
            for (let index = 0; index < this.eventMethods.length; index++) {
                let handler = this.eventMethods[index];
                if (handler.eventName === eventName) {
                    this.async(data, handler);
                }
            }
        }, un: function (eventName, id) {
            for (let index = 0; index < this.eventMethods.length; index++) {
                let handler = this.eventMethods[index];
                if (id) {
                    if (handler.eventName === eventName && handler.identifier === id) {
                        this.eventMethods.splice(index, 1);
                        index--;
                    }
                } else {
                    if (handler.eventName === eventName) {
                        this.eventMethods.splice(index, 1);
                        index--;
                    }
                }
            }
        }, remove: function () {
            this.eventMethods = [];
        }, destroy: function () {
            this.eventMethods = [];
        }
    },
    wss: {
        WS: null,
        msg_lock: 0,
        connect: function () {
            let thisCallback = this;
            //判断当前浏览器是否支持WebSocket
            if ('WebSocket' in window) {
                this.WS = new WebSocket("wss://127.0.0.1:13244/websocket_stream");
            } else {
                Message({
                    message: "当前浏览器不支持websocket",
                    type: 'error',
                    duration: 3 * 1000
                });
            }
            //连接发生错误的回调方法
            this.WS.onerror = function () {
                Message({
                    message: "连接错误",
                    type: 'error',
                    duration: 3 * 1000
                });
            };
            //连接成功建立的回调方法
            this.WS.onopen = function () {
                Message({
                    message: "连接成功",
                    type: 'success',
                    duration: 3 * 1000
                });
            };
            //接收到消息的回调方法
            this.WS.onmessage = function (event) {
                let data = event.data;
                websocket.events.triggerAll("sss", data)
            };
            this.WS.onclose = function () {
                Message({
                    message: "WebSocket连接关闭",
                    type: 'warning',
                    duration: 3 * 1000
                });
            };
            window.onbeforeunload = function () {
                thisCallback.close();
            };
        }, send: function (msg, rt) {
            let request = {
                t: rt,
                channel: state.channel,
                msg: msg
            };
            this.WS.send(JSON.stringify(request));
        },
        close: function () {
            if (this.WS !== null) {
                this.WS.close();
            }
        }
    }, state: {
        channel: '',
        events: null,
        client: null,
    },
    mutations: {},
    actions: {}
};
websocket.state.events = websocket.events;
websocket.state.client = websocket.wss;


export default websocket