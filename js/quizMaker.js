/* 
 * Copyright (C) 2016 jfalkenstein
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


$(function(){
    qm.bind('departments').to(function(depts){
                    var deptsDropDown = $('#deptsDropDown').not('#createDepartment');
                    deptsDropDown.find('li').not('[data-keep]').remove();
                    for(var d in depts){
                        var li = $('<li></li>');
                        var a = $('<a href=#>' + depts[d].Name + '</a>');
                        a.data('Id', depts[d].Id);
                        a.data('Name', depts[d].Name);
                        a.click(function(){
                            var jq = $(this);
                            qm.currentDepartment = qm.departments[jq.data('Id')];
                        });
                        li.append(a);    
                        deptsDropDown.prepend(li);
                    }
                });
                
                qm.bind('currentDepartment').to(function (dept){
                    $('#currentDepartment').html('Current Department: <strong>' + dept.Name + '</strong>.');
                });
});

(function($){
    
    function department(params){
        this.Id = params.Id;
        this.Name = params.Name;
        this.Quizzes = params.Quizzes;
    }
    
    function question(params){
        this.Id = params.Id;
        this.DepartmentId = params.DepartmentId;
        this.QuizId = params.QuizId;
        this.QuestionText = params.QuestionText;
        this.AnswersArray = params.AnswersArray;
        this.CorrectIndex = params.CorrectIndex;
        this.IncorrectMessage = params.IncorrectMessage;
    }    
    
    function quiz(params){
        this.Id = params.Id;
        this.Name = params.Name;
        this.DepartmentId = params.DepartmentId;
        this.QuestionOrders = params.QuestionOrders;
        this.Questions = {};
        this.parseParamsToQuestions(params);
    }
    
    quiz.prototype = {
        parseParamsToQuestions: function(params){
            var self = this;
            $.each(params.QuestionsArray, function(p, o){
                self.Questions[p] = new question(o);
            });
        }
    };
    
    function repository(qm){
        this.qm = qm;
        function displayLoading(){
            
        }
        
        function stopLoading(){
            
        }
        
        function applyDepartments(data){
            for(var d in data.data){
                this.departments[d] = new department(data.data[d]);
                this.stopLoading();
                this.updateBindings('departments');
            }
        }
        
        function getDepartments(){
            var parameters = {
                data: {
                    SUBJECT: 'departmentlist'
                },
                callback: applyDepartments
            };
            getData(parameters);
        }
        
        function storeDepartment(department){
            var parameters = {
                data: department,
                callback: applyDepartments
            };
            parameters.data['SUBJECT'] = 'department';
            parameters.data['ACTION'] = (department.Id) ? 'update' : 'create';
            postData(parameters);
        }
        
        function getData(parameters){
            displayLoading();
            sendAjaxRequest(
                parameters.data, 
                'GET', 
                parameters.callback,
                this.qm
            );
        }
        
        function postData(parameters){
            displayLoading();
            sendAjaxRequest(
                parameters.data,
                'POST',
                parameters.callback,
                this.qm
            );
        }
        
        function sendAjaxRequest(data, method, callback, context){
            $.ajax({
                data: data,
                dataType: 'json',
                method: method,
                url: 'index.php',
                context: context
            }).done(callback);
        }
        
        return {
            stopLoading: stopLoading,
            getDepartments: getDepartments,
            storeDepartment: storeDepartment
        };
    }
    
    function dataBinder(qm){
        this.qm = qm;
        this.bindings = {};
        var self = this;
        function bind(prop){
            return {
                to: function(binding){
                    if(!self.bindings[prop])
                        self.bindings[prop] = [];
                    self.bindings[prop].push(binding);
                }
            };
        }
        
        function update(prop){
            var bindings = self.bindings[prop];
            if(!bindings) return;
            for(var f in bindings){
                bindings[f](self.qm.prop(prop));
            }
        }
        
        return {
            bind: bind,
            update: update
        };
    }
    
    function quizMaker(){
        this._repository = new repository(this);
        this._dataBinder = new dataBinder(this);
        this.stopLoading = this._repository.stopLoading;
    };
    
    quizMaker.prototype = {
        //Getters and setters
        
        get departments(){
            return this.prop('departments');
        },
        set departments(x){
            this.prop('departments',x);
        },
        
        get currentDepartment(){
            return this.prop('currentDepartment');
        },
        set currentDepartment(x){
            this.prop('currentDepartment',x);
        },
        
        prop:function(propName, value){
            if(!value){
                return this['__'+ propName];
            }
            this['__'+propName] = value;
            this.updateBindings(propName);
        },
        
        bind: function (propertyName){
            return this._dataBinder.bind(propertyName);
        },
        
        
        updateBindings: function(propertyName){
            this._dataBinder.update(propertyName);
        },
        
        
        
        refreshDepartments: function(){
            this._repository.getDepartments();
        },
        createDepartment: function(name){
            var dept = new department({Name: name});
            this._repository.storeDepartment(dept);
        }
        
        
    };
    
    
    qm = new quizMaker();
    
})(jQuery);