import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CCardText, CCardTitle, CCarousel, CCarouselItem, CImage } from '@coreui/react';
import { Button } from '@mui/material';


const Detail = () => {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <CCard style={{ width: '30rem' }}>
      <CCarousel controls indicators>
        <CCarouselItem>
          <div class="d-flex justify-content-center">
            <CImage className="d-block" style={{ height: '350px', width: '400px' }} src={location.state.image_url} alt="slide 1" />
          </div>
        </CCarouselItem>
        <CCarouselItem>
          <div class="d-flex justify-content-center">
            <CImage className="d-block" style={{ height: '350px', width: '400px' }} src={location.state.image_url} alt="slide 2" />
          </div>
        </CCarouselItem>
        <CCarouselItem>
          <div class="d-flex justify-content-center">
            <CImage className="d-block" style={{ height: '350px', width: '400px' }} src={location.state.image_url} alt="slide 3" />
          </div>
        </CCarouselItem>
      </CCarousel>
      
      <CCardBody>
        <CCardTitle>{location.state.name}</CCardTitle>
        <CCardText>Price {location.state.price}</CCardText>
        <CCardText>
          Address : {' '}
          {location.state.location.address1 + ' '}
          {location.state.location.address2 + ' '}
          {location.state.location.address3 + ' '}
          City {location.state.location.city + ' '}
          Country {location.state.location.US + ' '}
          State {location.state.location.state}
        </CCardText>
        <CCardText><small className="text-medium-emphasis">Rating : {location.state.rating}</small></CCardText>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>Back</Button>
          <Button variant="contained" onClick={() => window.open("https://maps.google.com?q="+location.state.coordinates.latitude+","+location.state.coordinates.longitude ) }>See on google map</Button>
        </div>
      </CCardBody>
    </CCard>
  );
}

export default Detail;