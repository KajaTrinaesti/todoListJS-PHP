<?php 

    $todos = json_decode( file_get_contents('../todo.db'), true );
    var_dump($todos);
    function nadjiZadatak($id){
        global $todos;
        foreach( $todos as $key => $todo ){
            if( intval($todo['id']) == intval($id) ) return $key;
        }
        return false;
    }



    if( isset($_GET['id']) && $_GET['id'] != "" ){
        $id = $_GET['id'];
    }else{
        exit("Greska 0 - morate unijeti id...");
    }

    
    if( nadjiZadatak($id) !== FALSE ){
        $index = nadjiZadatak($id);
    }else{
        exit("Ne postoji zadatak sa predatim ID-jem...");
    }

    unset( $todos[$index] );
    
    $todos = array_values($todos);

    if( file_put_contents( '../todo.db', json_encode($todos) ) ){
        exit('OK');
    }else{
        exit('ERR');
    }
?>