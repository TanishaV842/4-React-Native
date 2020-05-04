import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Rating, Input } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';




const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))

};

function RenderCampsite(props) {

    const { campsite } = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{ uri: baseUrl + campsite.image }}>
                <Text style={{ margin: 10 }}>
                    {campsite.description}
                </Text>
                <Icon
                    name={props.favorite ? "heart" : "heart-o"}
                    type="font-awesome"
                    color="#f50"
                    raised
                    reverse
                    onPress={() => props.favorite ?
                        console.log("Already set as a favorite") : props.markFavorite()}
                />
                <Icon
                    name={'pencil'}
                    type='font-awesome'
                    color='#5637DD'
                    style={styles.CardItem}
                    raised
                    reverse
                    onPress={() => props.onShowModal()}
                />
            </Card>
        );
    }
    return <View />;
}

function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating
                    type='star'
                    fractions={0}
                    startingValue={item.rating}
                    imageSize={10}
                    readonly
                    style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                />
                <Text style={{ fontSize: 12 }}>{`${item.author}, ${item.date}`}</Text>
            </View>

        );
    };

    return (
        <Card title="comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            text: '',
            showModal: false
        };
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }


    handleComment(campsiteId) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(CampsiteId,
            this.state.rating,
            this.state.author,
            this.state.text
        );
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            text: '',
            showModal: false
        });
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.cardRow}>
                        <View style={styles.CardItem}>
                            <View style={styles.Modal}>
                                <View>
                                    <Button
                                        onPress={() => {
                                            this.handleComment(campsiteId);
                                            this.resetForm();
                                        }}
                                        title="Submit"
                                        color="#5637DD"
                                    />

                                    <Button
                                        onPress={() => {
                                            this.toggleModal();
                                        }}
                                        color='#808080'
                                        title='Cancel'
                                    />
                                    <Rating
                                        showRating
                                        startingValue={5}
                                        imageSize={40}
                                        style={{ paddingVertical: 10 }}
                                        onFinishRating={(rating) => this.setState({ rating: rating })}
                                    />
                                    <Input

                                        placeholder="Author"
                                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                        leftIconContainerStyle={{ paddingRight: 10 }}
                                        onChangeText={value => this.setState({ author: value })}

                                    />

                                    <Input
                                        placeholder="Comment"
                                        leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                        leftIconContainerStyle={{ paddingRight: 10 }}
                                        onChangeText={value => this.setState({ comment: value })}
                                    />

                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView >


        );

    }
}





const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },

    CardItem: {
        flex: 1,
        margin: 10
    },
    Modal: {
        justifyContent: 'center',
        margin: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);