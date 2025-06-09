import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function PageLoader({
  pageLoaderOpen,
  setPageLoaderOpen,
  content
}) {
  //   const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setPageLoaderOpen(false);
  };
  //   const handleToggle = () => {
  //     setOpen(!open);
  //   };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pageLoaderOpen}
        onClick={handleClose}
      >

        <CircularProgress color="inherit" />
        <span style={{paddingLeft: '20px'}}>{content ? content : 'Loading ...' }</span>
      </Backdrop>
    </div>
  );
}
