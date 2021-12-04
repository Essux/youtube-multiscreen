import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import './GridTest.css';
import { ReactComponent as PlusIcon } from './assets/plus.svg'
import { Fab, Action } from 'react-tiny-fab';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function VideoEmbed(props) {
  var { url } = props;
  return <iframe width="100%" height="100%" src={url}
    position='absolute' style={{ top: 0 }}
    title="YouTube video player" frameBorder="0"
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture">
  </iframe>;
}

export default class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [0, 1, 2].map(function (i, key, list) {
        const urls = [
          'https://www.youtube.com/embed/UPprAiXyzwQ', 
          'https://www.youtube.com/embed/sTc3xGblcko',
          'https://www.youtube.com/embed/mRJtcWsTipI',
          'https://www.youtube.com/embed/dGE64wFa11w',
          'https://www.youtube.com/embed/7vdU2d7eqnw'
        ];
        const url = urls[Math.floor(Math.random() * urls.length)]
        return {
          i: i.toString(),
          x: i * 4,
          y: Infinity,
          w: 4,
          h: 2,
          url: url,
        };
      }),
      newCounter: 0,
      open: false,
      enteredURL: '',
      isDragging: false,
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "3px",
      top: "2px",
      cursor: "pointer"
    };
    return (
      <div className="element" key={el.i} data-grid={el}>
        <div className='cover' hidden={!this.state.isDragging}></div>
        <div className='banner' zIndex={10}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="currentColor" viewBox="0 0 16 16"
            className="remove"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, el.i)}>
            <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
            <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
          </svg>
        </div>
        <VideoEmbed url={el.url} />
      </div>
    );
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
    this.setState({ layout: layout });
  }

  onRemoveItem(i) {
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }

  closeDialog() {
    this.setState({open: false});
  }

  openDialog() {
    this.setState({open: true});
  }

  createEmbedURL(url) {
    const urlRegex = /https:\/\/www\.youtube\.com\/watch\?v=(?<id>.+)/;
    const videoID = urlRegex.exec(url).groups.id;
    return `https://www.youtube.com/embed/${videoID}`;
  }

  onAddItem() {
    const embedURL = this.createEmbedURL(this.state.enteredURL);
    this.setState({
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        url: embedURL,
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
      enteredURL: ''
    });
    this.closeDialog();
  }

  handleURLChange(event) {
    this.setState({enteredURL: event.target.value});
  }

  onDragStart() {
    this.setState({isDragging: true});
  }

  onDragEnd() {
    console.log('drag end');
    this.setState({isDragging: false});
  }

  render() {
    return (
      <div>
        <Fab
          icon={<PlusIcon />}
          mainButtonStyles={{ backgroundColor: '#a62c1c' }}>
          <Action
            text="Add video"
            onClick={this.openDialog}>
            <PlusIcon />
          </Action>
        </Fab>
        <div>
            <Dialog open={this.state.open} onClose={this.closeDialog}>
                <DialogContent>
                    <TextField
                        value={this.state.enteredURL}
                        onChange={this.handleURLChange}
                        autoFocus
                        margin="normal"
                        id="video-url"
                        label="URL"
                        type="url"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onAddItem}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          onDragStart={this.onDragStart}
          onResizeStart={this.onDragStart}
          onDragStop={this.onDragEnd}
          onResizeStop={this.onDragEnd}
        >
          {this.state.items.map(el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}