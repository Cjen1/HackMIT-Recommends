#from bottle import route, run, 
#
#@route('/rec')
#def get_recommendation():
#    user_id = request.query.id
#    return "Hello !"
#
#run(host='localhost', port=8080, debug=True)

from bottle import route, request, response, template, run
import recommend

@route('/hello')
def hello_world():
    return("Hello World!!")

@route('/rec')
def get_recommendation():
    return recommend.get_rec(request.query['user_id'])

@route('/like')
def add_like():
    return recommend.add_like(request.query['user_id'],request.query['title'])

run(host='0.0.0.0', port=8080)
    

