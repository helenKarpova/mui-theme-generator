import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import Components from './Components';
import ThemeSelector from '../ThemeSelector/ThemeSelector';
import ThemeGeneratorDialog from '../ThemeSelector/ThemeGeneratorDialog';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    left: {
        // display: 'flex',
    },
    right: {
        width: 450,
        flexShrink: 0
    },
    rightInner: {
        position: 'fixed',
        height: '100%',
        width: 'inherit'
    },
    scrollContent: {
        overflowY: 'overlay',
        height: '100%'
    }
};

export default class Main extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            themeName: "dark",
            palette: {},
            dialogOpen: false
        };
    }

    handleBaseThemeChange = (themeName) => {
        this.setState({
            themeName
        });
    };

    handleonColorChange = (key, newValue) => {
        var palette = Object.assign({}, this.state.palette, { [key]: newValue });
        this.setState({
            palette
        });
    }

    handleDialogOpen = () => {
        this.setState({ dialogOpen: true });
    }

    handleDialogClose = () => {
        this.setState({ dialogOpen: false });
    }

    removeFromPalette = (omitted) => {
        var palette = Object.keys(this.state.palette)
            .filter(key => key != omitted)
            .reduce((result, key) => {
                result[key] = this.state.palette[key];
                return result;
            }, {});

        this.setState({
            palette
        });
    }

    render() {
        let baseTheme = this.state.themeName === "dark" ? darkBaseTheme : null;
        let palette = this.state.palette;
        let muiTheme = getMuiTheme(baseTheme, { palette });
        let components = Object.assign(...
            Object.keys(muiTheme)
                .filter(x => x != 'palette')
                .map(x => ({ [x]: muiTheme[x] })));

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Paper zDepth={1} >
                    <div style={styles.container}>
                        <div style={styles.left}>
                            <Components />
                        </div>
                        <div style={styles.right}>
                            <div style={styles.rightInner}>
                                <div style={styles.scrollContent}>
                                    <ThemeSelector
                                        themeName={this.state.themeName}
                                        changeBaseTheme={this.handleBaseThemeChange}
                                        theme={muiTheme}
                                        palette={palette}
                                        components={components}
                                        removeFromPalette={this.removeFromPalette}
                                        openDialog={this.handleDialogOpen}
                                        onColorChange={this.handleonColorChange} />
                                </div>
                            </div>
                        </div>
                        <ThemeGeneratorDialog
                            open={this.state.dialogOpen}
                            handleOpen={this.handleDialogOpen}
                            handleClose={this.handleDialogClose}
                            palette={this.state.palette}
                            themeName={this.state.themeName}
                        />
                    </div>
                    <a style={{ position: 'fixed', top: -8, right: 8 }} href="https://github.com/cimdalli/mui-theme-generator">
                        <IconButton iconClassName="muidocs-icon-custom-github" />
                    </a>
                </Paper>
            </MuiThemeProvider>
        );
    }
}