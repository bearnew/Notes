function withAuth(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            // 当用户处于登录状态，才进行渲染
            if (this.props.loggedIn) {
                return super.render();
            } else {
                return null;
            }
        }
    }
}
