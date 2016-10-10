/* 
 * Copyright (C) 2016 jtfalkenstein
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


requirejs.config({
    baseUrl: 'js/lib',
    paths:{
        handlebars: '/bower_components/handlebars/handlebars.min',
        underscore: '/bower_components/underscore/underscore-min'
    },
    shim:{
        'handlebars':{
            exports: 'Handlebars'
        },
        'underscore':{
            exports: '_'
        }
    }
});


requirejs(['quizMaker', 'templating', 'windows', 'repository'], function(qm, templating, windows, repo){
    
    templating.initialize();
    
    var navBar = new windows.navBar();
    
    qm.bind('departments').to(function(){
        navBar.render();
    });
    qm.bind('currentQuiz').to(function(){
        navBar.render();
    });
    qm.bind('currentDepartment').to(function(){
        navBar.render();
    });
    qm.bind('currentQuiz').to(function(quiz){
    });
    repo.getDepartments();
    

});
