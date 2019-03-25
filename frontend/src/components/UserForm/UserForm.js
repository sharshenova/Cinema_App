import React, {Component} from 'react'



class UserForm extends Component {
    // в props передаются начальные данные юзера
    // в дальнейшем они копируются в state и извне компонента UserForm больше не меняются
    // (всё остальное управление значением user и его полей лежит на UserForm).
    constructor(props) {
        super(props);

        // пустой объект для формы создания
        const newUser = {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            password: ""
        };

        this.state = {
            submitEnabled: true,
            // изначально user пустой
            user: newUser,
        };

        // если user передан через props
        if(this.props.user) {
            // записываем в state существующий user
            this.state.user = this.props.user;
        }
    }

    // блокировка отправки формы на время выполнения запроса
    disableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = false;
            return newState;
        });
    };

    // разблокировка отправки формы
    enableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = true;
            return newState;
        });
    };

    // функция, обновляющая поля в this.state.user
    updateUserState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let user = {...prevState.user};
            user[fieldName] = value;
            newState.user = user;
            return newState;
        });
    };

    // обработчик ввода в поля ввода
    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateUserState(fieldName, value);
    };

    // отправка формы
    // внутри вызывает onSubmit - переданное действие - со своим фильмом в качестве аргумента.
    submitForm = (event) => {
        if(this.state.submitEnabled) {
            event.preventDefault();
            this.disableSubmit();
            this.props.onSubmit(this.state.user)
                .then(this.enableSubmit);
        }
    };

    // принимает имя поля (или 'non_field_errors' -  если ошибка связана не с конкретным полем, а с общей логикой формы)
    // и возвращает список элементов разметки для соответствующего набора сообщений, если они есть
    showErrors = (name) => {
        console.log(this.props.errors, 'error_info');
        if(this.props.errors && this.props.errors[name]) {
            return this.props.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        if (this.state.user) {
            // распаковка данных фильма, чтобы было удобнее к ним обращаться
            const {username, email, first_name, last_name, password} = this.state.user;
            // распаковка переменных из state.
            const {submitEnabled} = this.state;


            return <div>
                <h2>{username}</h2>
                <form className='mt-4' onSubmit={this.submitForm}>
                    {this.showErrors('non_field_errors')}
                    <div className="form-group">
                        <label className="font-weight-bold">Email</label>
                        <input type="text" className="form-control" name="email" value={email}
                               onChange={this.inputChanged}/>
                        {this.showErrors('email')}
                    </div>
                    <div className="form-group">
                        <label>Имя</label>
                        <input type="text" className="form-control" name="first_name" value={first_name}
                               onChange={this.inputChanged}/>
                        {this.showErrors('first_name')}
                    </div>
                    <div className="form-group">
                        <label>Фамилия</label>
                        <input type="text" className="form-control" name="last_name" value={last_name}
                               onChange={this.inputChanged}/>
                        {this.showErrors('last_name')}
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="text" className="form-control" name="password" value={password}
                               onChange={this.inputChanged}/>
                        {this.showErrors('password')}
                    </div>
                    <button disabled={!submitEnabled} type="submit"
                            className="btn btn-primary">Сохранить
                    </button>
                </form>
            </div>;
        }
    }
}


export default UserForm;