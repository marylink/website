<?php

    namespace Controller;

    use Config\Config;
    use Symfony\Component\Routing\Matcher\UrlMatcher;
    use Symfony\Component\HttpFoundation\Request;

    class App {

        public function run(){
            $this->createGlobals();
            $this->useSession();
            $this->handleRouting();
        }

        private function createGlobals(){
            //some globals like $routes
            require_once("../Config/routes.php");
            $GLOBALS['routes'] = $routes;

            //request context globally available
            $GLOBALS['context'] = new \Symfony\Component\Routing\RequestContext();
        }

        private function useSession(){
            session_set_cookie_params(31536000,"/"); //will expire in 1 year
            
            //see also in SecurityHelper//

            //we use sessions
            session_start();
        }

        private function handleRouting(){

            global $routes, $context;
                    
            //symfony shit to get the route
            $context->fromRequest(Request::createFromGlobals());
            $matcher = new UrlMatcher($routes, $context);
            try {
                $urlParameters = $matcher->match($context->getPathInfo());
            }
            catch(\Symfony\Component\Routing\Exception\ResourceNotFoundException $e){
                Router::fourofour($e->getMessage());
            }

            //instanciate the controller
            $className = "Controller" . '\\' . $urlParameters['controller'] . "Controller";
            $controller = new $className();

            // method
            $method = $urlParameters['action'] . 'Action';

            //extract the parameters from url, and pass them to the method based on key name
            try {
                $r = new \ReflectionMethod($className, $method);
            }
            catch (\ReflectionException $e){
                Router::fourofour($e->getMessage());
            }
            $methodParams = $r->getParameters();
            $params = array();
            foreach ($methodParams as $param) {
                foreach($urlParameters as $urlParameterName => $value){
                    if ($param->getName() == $urlParameterName){
                        $params[] = $value;
                    }
                }
            }

            //call it
            call_user_func_array(array($controller, $method), $params);
        }


    }