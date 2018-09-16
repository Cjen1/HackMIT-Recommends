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

@route('/rec')
def get_recommendation():
    return recommend.get_rec(request.query['user_id'])

run(host='localhost', port=8080)
    

