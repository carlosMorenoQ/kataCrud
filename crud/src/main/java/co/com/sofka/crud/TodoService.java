package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

    @Autowired
    private TodoRepositoty repositoty;

    public Iterable<Todo> list(){
        return repositoty.findAll();
    }

    public Todo save(Todo todo){
        return repositoty.save(todo);
    }

    public void delete(Long id){
        repositoty.delete(get(id));
    }

    public Todo get(Long id){
        return repositoty.findById(id).orElseThrow();
    }

}
