import { DocPage } from "../../../components/DocPage";
import { ReferenceTable } from "../../../components/ReferenceTable";
import { createPageMetadata } from "../../../lib/site-metadata";

const description =
  "Field-by-field reference for the normalized OAKit PowerPoint document, slide, element, fill, table, chart, and media models.";

export const metadata = createPageMetadata({
  title: "PPTX document model",
  description,
  path: "/docs/api/document-model",
});

const elementKinds = [
  ["shape", "Shape", "Preset or custom geometry, fill, border, path, and optional text."],
  ["text", "Text", "Positioned rich-text HTML and text-box layout."],
  ["image", "Image", "Image relationship, selected payload, crop, filters, and border."],
  ["table", "Table", "Rows, cells, merges, dimensions, fills, and borders."],
  ["chart", "CommonChart | ScatterChart", "Normalized series or scatter/bubble coordinate arrays."],
  ["video", "Video", "Embedded or external media reference and optional object URL."],
  ["audio", "Audio", "Embedded media reference and optional object URL."],
  ["diagram", "Diagram", "SmartArt drawing elements and logical text list."],
  ["math", "Math", "LaTeX plus optional fallback-picture representations."],
  ["group", "Group", "Nested elements in a group coordinate space."],
] as const;

const shapeTextFields = [
  ["type", "shape | text", "Discriminator used for safe narrowing."],
  ["id", "string", "OOXML non-visual element ID as a string."],
  ["left, top", "number", "Position in points."],
  ["width, height", "number", "Size in points."],
  ["borderColor", "string", "Normalized border color."],
  ["borderWidth", "number", "Border width."],
  ["borderType", "solid | dashed | dotted", "Normalized border style."],
  ["borderStrokeDasharray", "string", "SVG/CSS-compatible dash pattern when available."],
  ["shadow", "Shadow?", "Optional horizontal/vertical offset, blur, and color."],
  ["fill", "Fill | null", "Color, image, gradient, pattern, or no fill."],
  ["content", "string", "Escaped rich-text HTML fragment."],
  ["isFlipV, isFlipH", "boolean", "Vertical and horizontal flip state."],
  ["rotate", "number", "Rotation in degrees."],
  ["vAlign", "string", "Normalized vertical text alignment."],
  ["wrap", "boolean", "Whether text wrapping is enabled."],
  ["name", "string", "OOXML non-visual element name."],
  ["order", "number", "Document stacking/order value."],
  ["autoFit", "AutoFit?", "Shape or text autofit mode and optional font scale."],
  ["textInset", "TextInset?", "Left, top, right, and bottom text insets."],
  ["link", "string?", "Sanitized supported hyperlink target."],
] as const;

const shapeOnlyFields = [
  ["shapType", "string", "Public property name for the preset shape type; custom geometry uses custom."],
  ["path", "string?", "SVG-compatible path generated for supported geometry."],
  ["pathViewBox", "PathViewBox?", "Coordinate box for the generated path."],
  ["headEnd, tailEnd", "LineEnd?", "Connector/line ending type and optional size."],
  ["strokeOnly", "boolean?", "True when custom geometry should not be filled."],
  ["keypoints", "Record<string, number>?", "Normalized shape adjustment values."],
] as const;

const imageFields = [
  ["type", "image", "Element discriminator."],
  ["id", "string", "OOXML element ID."],
  ["left, top, width, height", "number", "Position and dimensions in points."],
  ["ref", "string", "Resolved package-part reference."],
  ["base64", "string", "Data URL when imageMode is base64 or both; otherwise empty."],
  ["blob", "string", "Object URL when imageMode is blob or both; otherwise empty."],
  ["rotate", "number", "Rotation in degrees."],
  ["isFlipH, isFlipV", "boolean", "Image flip state."],
  ["order", "number", "Document stacking/order value."],
  ["rect", "{ t?, b?, l?, r? }?", "Optional crop percentages/sides."],
  ["geom", "string", "Picture geometry/preset shape."],
  ["border*", "color, width, type, dasharray", "Normalized picture border fields."],
  ["filters", "object?", "Sharpen, temperature, saturation, brightness, and contrast values."],
  ["link", "string?", "Sanitized supported hyperlink target."],
] as const;

const tableFields = [
  ["type", "table", "Element discriminator."],
  ["id", "string", "OOXML element ID."],
  ["left, top, width, height", "number", "Position and dimensions in points."],
  ["data", "TableCell[][]", "Rows containing normalized table cells."],
  ["borders", "object", "Optional top, bottom, left, and right table borders."],
  ["rowHeights", "number[]", "Row heights in points."],
  ["colWidths", "number[]", "Column widths in points."],
  ["order", "number", "Document stacking/order value."],
] as const;

const cellFields = [
  ["text", "string", "Escaped rich-text HTML fragment."],
  ["rowSpan, colSpan", "number?", "Declared vertical or horizontal span."],
  ["vMerge, hMerge", "number?", "Merge-continuation markers from OOXML."],
  ["fillColor", "string?", "Normalized cell fill color."],
  ["fontColor", "string?", "Normalized representative font color."],
  ["fontBold", "boolean?", "Representative bold state."],
  ["vAlign", "string", "Normalized vertical alignment."],
  ["borders", "object", "Optional border for each cell edge."],
] as const;

const chartFields = [
  ["type", "chart", "Element discriminator."],
  ["id", "string", "OOXML element ID."],
  ["left, top, width, height", "number", "Position and dimensions in points."],
  ["chartType", "ChartType", "One of the exported chart-type string literals."],
  ["data", "ChartItem[] | number[][]", "Series data, or coordinate arrays for scatter/bubble charts."],
  ["colors", "string[]", "Normalized series colors."],
  ["barDir", "bar | col?", "Optional bar direction for compatible chart types."],
  ["marker", "boolean?", "Optional marker visibility."],
  ["holeSize", "string?", "Doughnut-hole size when present."],
  ["grouping", "string?", "OOXML grouping value when present."],
  ["style", "string?", "Chart style identifier when present."],
  ["order", "number", "Document stacking/order value."],
] as const;

const visualTypes = [
  ["ColorFill", "{ type: 'color'; value: string }", "Solid normalized color."],
  ["ImageFill", "ref, base64, blob, opacity", "Image package ref and selected representations."],
  ["GradientFill", "path, rot, colors[]", "Linear/path gradient and color stops."],
  ["PatternFill", "type, foregroundColor, backgroundColor", "OOXML pattern fill."],
  ["Border", "borderColor, borderWidth, borderType", "One normalized edge."],
  ["Shadow", "h, v, blur, color", "Shadow geometry and color."],
  ["AutoFit", "type, fontScale?", "Shape/text fit policy."],
  ["TextInset", "l, t, r, b", "Four text-box inset values."],
  ["PathViewBox", "x, y, width, height", "Coordinate system for an SVG path."],
  ["LineEnd", "type, width?, length?", "Arrow/connector endpoint."],
] as const;

export default function DocumentModelReference() {
  return (
    <DocPage
      eyebrow="API · Types"
      title="Understand every returned field."
      description={description}
    >
      <section className="doc-section">
        <h2>Model conventions</h2>
        <ul className="check-list">
          <li>Positions, slide size, row heights, and column widths use points.</li>
          <li>Element arrays preserve normalized document order through the order field.</li>
          <li>Element is a discriminated union; narrow on type before reading variant fields.</li>
          <li>Text and table-cell text are escaped HTML fragments, not plain text.</li>
          <li>Empty media strings mean that the corresponding output mode was disabled or unavailable.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>PptxDocument</h2>
        <div className="api-signature">{`interface PptxDocument {
  slides: PptxSlide[];
  themeColors: string[];
  usedFonts: string[];
  size: { width: number; height: number };
}`}</div>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={[
            ["slides", "PptxSlide[]", "Slides in presentation-manifest order."],
            ["themeColors", "string[]", "Normalized colors resolved from the active theme."],
            ["usedFonts", "string[]", "Font families discovered across presentation XML."],
            ["size", "{ width; height }", "Presentation canvas in points."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>PptxSlide</h2>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={[
            ["fill", "Fill", "Resolved slide background fill."],
            ["elements", "PptxElement[]", "Elements authored on the slide."],
            ["layoutElements", "PptxElement[]", "Inherited layout/master elements kept separate from authored content."],
            ["note", "string", "Extracted speaker-note text."],
            ["transition", "SlideTransition | null?", "Transition type, duration in milliseconds, and optional direction."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>PptxElement union</h2>
        <div className="api-signature">{`type BaseElement =
  | Shape | Text | Image | Table | Chart
  | Video | Audio | Diagram | Math;

type Element = BaseElement | Group;

type PptxElement = Element;`}</div>
        <ReferenceTable
          headings={["type", "Interface", "Content"]}
          codeColumns={[0, 1]}
          rows={elementKinds}
        />
        <div className="code-block">
          <div><span>Exhaustive narrowing</span></div>
          <pre><code>{`function summarize(element: PptxElement): string {
  switch (element.type) {
    case 'text': return element.content;
    case 'table': return element.data.flat().map(cell => cell.text).join(' ');
    case 'diagram': return element.textList.join(' ');
    case 'group': return element.elements.map(summarize).join(' ');
    case 'math': return element.text ?? element.latex;
    default: return '';
  }
}`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Shape and Text</h2>
        <p>
          These interfaces share most geometry, border, fill, text-layout, and
          hyperlink fields. A <code>Text</code> additionally has
          <code>isVertical</code>; a <code>Shape</code> adds geometry fields.
        </p>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={shapeTextFields}
        />
        <h3>Shape-only fields</h3>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={shapeOnlyFields}
        />
        <p className="field-note">
          <strong>The property is currently spelled <code>shapType</code>.</strong>
          Treat that exact spelling as the pre-stable public contract until a
          versioned model change says otherwise.
        </p>
      </section>

      <section className="doc-section">
        <h2>Image</h2>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={imageFields}
        />
      </section>

      <section className="doc-section">
        <h2>Table and TableCell</h2>
        <ReferenceTable
          headings={["Table field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={tableFields}
        />
        <h3>TableCell</h3>
        <ReferenceTable
          headings={["Cell field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={cellFields}
        />
      </section>

      <section className="doc-section">
        <h2>Chart</h2>
        <ReferenceTable
          headings={["Field", "Type", "Meaning"]}
          codeColumns={[0, 1]}
          rows={chartFields}
        />
        <h3>Series shapes</h3>
        <ReferenceTable
          headings={["Type", "Fields", "Meaning"]}
          codeColumns={[0, 1]}
          rows={[
            ["ChartItem", "key, values, xlabels", "One named common-chart series."],
            ["ChartValue", "x: string; y: number", "One indexed/category value."],
            ["ChartXLabel", "Record<string, string>", "Map from x index to category label."],
            ["ScatterChartData", "number[][]", "Numeric coordinate arrays for scatter and bubble charts."],
          ]}
        />
        <p>
          <code>ChartType</code> is the exact exported string union below.
        </p>
        <div className="api-signature">{`type ChartType =
  | 'lineChart' | 'line3DChart'
  | 'barChart' | 'bar3DChart'
  | 'pieChart' | 'pie3DChart' | 'doughnutChart'
  | 'areaChart' | 'area3DChart'
  | 'scatterChart' | 'bubbleChart' | 'radarChart'
  | 'surfaceChart' | 'surface3DChart' | 'stockChart';`}</div>
      </section>

      <section className="doc-section">
        <h2>Media, diagram, math, and group</h2>
        <p>
          All five interfaces include <code>id</code>, <code>left</code>,
          <code>top</code>, <code>width</code>, <code>height</code>, and
          <code>order</code>. Position and size values use points.
        </p>
        <ReferenceTable
          headings={["Interface", "Fields beyond common geometry", "Meaning"]}
          codeColumns={[0, 1]}
          rows={[
            ["Video", "rotate, ref, blob, order", "Video relationship and optional object URL."],
            ["Audio", "rotate, ref, blob, order", "Audio relationship and optional object URL."],
            ["Diagram", "elements, textList, order", "Rendered Shape/Text nodes plus logical SmartArt text."],
            ["Math", "latex, picRef, picBase64, picBlob, text?, order", "Equation model and optional fallback picture."],
            ["Group", "rotate, elements, order, isFlipH, isFlipV", "Recursive element container."],
          ]}
        />
      </section>

      <section className="doc-section">
        <h2>Fill and visual primitives</h2>
        <div className="api-signature">{`type Fill = ColorFill | ImageFill | GradientFill | PatternFill;`}</div>
        <ReferenceTable
          headings={["Type", "Public fields", "Meaning"]}
          codeColumns={[0, 1]}
          rows={visualTypes}
        />
      </section>

      <section className="doc-callout">
        <div>
          <span>Rendering boundary</span>
          <h2>The model describes Office content; it is not a slide renderer.</h2>
        </div>
        <p>
          Use positions, paths, fills, text fragments, and media to build a
          renderer or an agent index. Unsupported optional OOXML may be omitted
          with diagnostics instead of represented inaccurately.
        </p>
      </section>
    </DocPage>
  );
}
