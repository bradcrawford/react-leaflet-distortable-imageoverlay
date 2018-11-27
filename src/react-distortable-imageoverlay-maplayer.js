import { MapLayer, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

import DistortableImageOverlay from './lib/leaflet-distortableimage';

type Props = {
  url: PropTypes.string,
  corners: [L.latlng, L.latlng, L.latlng, L.latlng],
  opacity: PropTypes.number,
  editMode: PropTypes.string, // 'rotate' or 'distort'
  onUpdate: (corners) => void;
} & MapLayerProps;

class ReactDistortableImageOverlayMapLayer extends MapLayer<LeafletElement, Props> {

  createLeafletElement(props: Props): LeafletElement {
    this.distortableImage = new DistortableImageOverlay(props.url, this.getOptions(props));

    L.DomEvent.on(this.distortableImage, 'load', () => {
      this.distortableImage._image.style.opacity = this.props.opacity;
      this.handleEditModeState(props.editMode);

    }, this.distortableImage);

    this.distortableImage.on('edit', (update) => {
      this.props.onUpdate(update.sourceTarget._corners);
    }, this.distortableImage);

    return this.distortableImage;
  }

  updateLeafletElement(fromProps, toProps) {
    // Keep map ref before removing so we can addLayer when the LeafletElement is recreated
    var map = this.distortableImage._map;
    this.distortableImage.onRemove();

    const corners = this.distortableImage._corners;
    this.distortableImage = new DistortableImageOverlay(toProps.url, {...this.getOptions(toProps), corners });

    // Apply opacity after the image loads
    L.DomEvent.on(this.distortableImage, 'load', () => {
      this.distortableImage._image.style.opacity = this.props.opacity;
    }, this.distortableImage);

    // Re-add the update listener
    this.distortableImage.on('edit', (update) => {
      this.props.onUpdate(update.sourceTarget._corners);
    }, this.distortableImage);

    map.addLayer(this.distortableImage);

    this.handleEditModeState(toProps.editMode);
  }

  handleEditModeState(editMode) {
    switch (editMode) {
      case 'rotate':
        this.distortableImage.editing.enable();
        this.distortableImage.editing._toggleRotateDistort();
        this.distortableImage._image.style.opacity = this.props.opacity;
        break;

      case 'distort':
        this.distortableImage.editing.enable();
        this.distortableImage._image.style.opacity = this.props.opacity;
        break;
      default:
        this.distortableImage.editing.disable();
        this.distortableImage._image.style.opacity = this.props.opacity;
    }
  }
}

export default withLeaflet(ReactDistortableImageOverlayMapLayer);
