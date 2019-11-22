import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {postRatings} from "../actions/index";


class VoteBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            userVoted: false
        }
    }

    renderField(field){

        const {meta: {touched, error}} = field;
        const className = `form-group ${touched && error ? `has-danger` : ''}`;

        return(
            <div className={className}>
                <label>{field.label}</label>
                <input
                    className="form-control"
                    {...field.input}
                />
                <div className="text-help">
                    {touched ? error : ''}
                </div>
            </div>
        )
    }


    onSubmit(values){
        this.props.postRatings(this.props.selectedArtist.id, values);
        this.setState({
            userVoted: true
        })
    }

    render() {
        const {handleSubmit} = this.props;
        const allowedRatingString = "   (0-10)";

        if(this.state.userVoted){
            return (
                <div>
                    <h1>Thanks for voting!</h1>
                </div>
            )
        }else{
            return (
                <form id="voteForm" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <div className="row voteBar">
                        <div className="col-4">
                            <Field
                                label={`Flow Rating : : :${allowedRatingString}`}
                                name="flow"
                                component={this.renderField}
                            />
                        </div>
                        <div className="col-4">
                            <Field
                                label={`Wordplay Rating : : :${allowedRatingString}`}
                                name="wordplay"
                                component={this.renderField}
                            />
                        </div>
                        <div className="col-4">
                            <Field
                                label={`Consistency Rating : : :${allowedRatingString}`}
                                name="consistency"
                                component={this.renderField}
                            />
                        </div>
                    </div>
                    <div className="row voteBar">
                        <div className="col-6">
                            <Field
                                label={`Influence rating : : :${allowedRatingString}`}
                                name="influence"
                                component={this.renderField}
                            />
                        </div>
                        <div className="col-6">
                            <Field
                                label={`Bangers rating : : :${allowedRatingString}`}
                                name="bangers"
                                component={this.renderField}
                            />
                        </div>
                        <button id="submitButton" type="submit" className="btn btn-info">Submit</button>
                    </div>
                </form>
            );
        }
    }
}

function validate(values){
    const errors = {};
    if(!values.wordplay){
        errors.wordplay = "Rate the words!";
    }else if(isNaN(values.wordplay) || (values.wordplay > 10 || values.wordplay < 0)){
        errors.wordplay = "A number between 0 and 10!";
    }
    if(!values.consistency){
        errors.consistency = "Rate the consistency!";
    }else if(isNaN(values.consistency) || (values.consistency > 10 || values.consistency < 0)){
        errors.consistency = "A number between 0 and 10!";
    }
    if(!values.influence){
        errors.influence = "Rate the influence!";
    }else if(isNaN(values.influence) || (values.influence > 10 || values.influence < 0)){
        errors.influence = "A number between 0 and 10!";
    }
    if(!values.bangers){
        errors.bangers = "Rate the bangers!";
    }else if(isNaN(values.bangers) || (values.bangers > 10 || values.bangers < 0)){
        errors.bangers = "A number between 0 and 10!";
    }
    if(!values.flow){
        errors.flow = "Rate the flow!";
    } else if(isNaN(values.flow) || (values.flow > 10 || values.flow < 0)){
        errors.flow = "A number between 0 and 10!";
    }

    return errors;
}

function mapStateToProps(state) {
    return {
        selectedArtist: state.selectedArtist
    }
}

VoteBar = connect(mapStateToProps, {postRatings})(VoteBar);

export default reduxForm({
    validate: validate,
    form: 'VoteBar'
})(VoteBar);